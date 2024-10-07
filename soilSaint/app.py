import os
import re
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://{username}:{password}@{host}/{db}'.format(
    username=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASSWORD'),
    host=os.getenv('MYSQL_HOST'),
    db=os.getenv('MYSQL_DB'),
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def preprocess_input(user_input):
    corrections = {
        "loomy": "loamy",
        "tropic": "tropical",
        "tropicalal": "tropical",  
        "dry": "arid",
        "moist": "humid",
        "humid": "humid",
        "hot": "hot",
        "warm": "hot",
        "cold": "cold",
        "cool": "cold",
        "desert": "arid",  
    }

    for mistake, correction in corrections.items():
        user_input = re.sub(rf'\b{mistake}\b', correction, user_input)

    return user_input

def postprocess_sql_query(sql_query):
    corrections = {
        "tropicalal": "tropical"  
    }
    for mistake, correction in corrections.items():
        sql_query = re.sub(rf'\b{mistake}\b', correction, sql_query)
    return sql_query

def generate_sql_query(user_input):
    table_schema = """
    The database has a table called `farm_conditions`.

    Table `farm_conditions`:
    - id (Integer, Primary Key)
    - soil_type (String, 50 characters)
    - climate (String, 50 characters)
    - temperature_min (Integer)
    - temperature_max (Integer)
    - moisture_content (String, 50 characters)
    - region (String, 50 characters)
    - crop_name (String, 50 characters)
    - growth_duration (Integer)
    - water_requirements (String, 50 characters)
    - sunlight_requirements (String, 50 characters)
    - yield_per_hectare (Decimal, 10,2)
    """

    prompt = f"""
    Convert the following farm description to an SQL query using only valid columns from the table schema.
    The query should handle climate, soil type, moisture content, and region appropriately.

    User Input: "{user_input}"

    Only include valid columns from the table schema: `crop_name`, `climate`, `soil_type`, `moisture_content`, `region`, `growth_duration`, `water_requirements`, `sunlight_requirements`, `yield_per_hectare`, `temperature_min`, `temperature_max`.
    Do not use non-existent columns like `planting_season`.

    Example: For input "my farm is humid and in South America," match "humid" to `climate` and "South America" to `region`.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert SQL query generator. Generate SQL queries that select crop data from the farm_conditions table based on farm conditions."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.5
        )

        full_response = response.choices[0].message.content.strip()
        print(f"Full OpenAI response: {full_response}")

        sql_match = re.search(r"SELECT\s.+?\sFROM\s.+?;", full_response, re.DOTALL | re.IGNORECASE)

        if sql_match:
            sql_query = sql_match.group(0).strip().replace("```", "").strip()

            sql_query = postprocess_sql_query(sql_query)

            return sql_query
        else:
            raise ValueError("The response from OpenAI does not contain a valid SQL query.")
    except Exception as e:
        print(f"Error generating SQL query: {e}")
        raise

@app.route('/natural_query', methods=['POST'])
def natural_query():
    try:
        user_input = request.json.get('query')

        if not user_input:
            return jsonify({"error": "User input is required."}), 400

        processed_input = preprocess_input(user_input)
        print(f"Processed input: {processed_input}")

        try:
            sql_query = generate_sql_query(processed_input)
        except Exception as e:
            return jsonify({"error": "There was an error generating the SQL query."}), 500

        print(f"Generated SQL query: {sql_query}")

        try:
            result = db.session.execute(text(sql_query))
            results_list = [dict(row._mapping) for row in result]
        except Exception as e:
            print(f"Error executing SQL query: {e}")
            return jsonify({"error": "There was an error executing the SQL query."}), 500

        print(f"Query result: {results_list}")

        if not results_list:
            return jsonify({"message": "Sorry, no suitable crops were found for your farm."})

        crop = results_list[0]

        crop_info_parts = [
            f"The crop best suited for your farm is {crop.get('crop_name', 'unknown')}."
        ]

        if crop.get('climate'):
            crop_info_parts.append(f"It can grow in {crop['climate']} climate.")

        if crop.get('growth_duration'):
            crop_info_parts.append(f"It takes about {crop['growth_duration']} days to grow.")

        if crop.get('water_requirements'):
            crop_info_parts.append(f"It requires {crop['water_requirements']} water.")

        if crop.get('sunlight_requirements'):
            crop_info_parts.append(f"It thrives in {crop['sunlight_requirements']} sunlight.")

        if crop.get('yield_per_hectare'):
            crop_info_parts.append(f"The yield per hectare is around {crop['yield_per_hectare']} tons.")

        if crop.get('temperature_min') and crop.get('temperature_max'):
            crop_info_parts.append(f"It can tolerate temperatures between {crop['temperature_min']} and {crop['temperature_max']} degrees Celsius.")

        if crop.get('region'):
            crop_info_parts.append(f"This crop is commonly found in the {crop['region']} region.")

        crop_info = " ".join(crop_info_parts)

        return jsonify({"message": crop_info})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
