import React, { useState } from 'react';
import './styles.css';

const HomePage = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/natural_query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();
            setResult(data.message || 'No results found.');
            setShowResultModal(true); // Show the result modal
        } catch (error) {
            console.error('Error fetching data:', error);
            setResult('Error fetching data. Please try again.');
            setShowResultModal(true); // Show the result modal even if there's an error
        }
    };

    // Toggle modals
    const toggleModal = () => setShowModal(!showModal);
    const closeResultModal = () => setShowResultModal(false);

    return (
        <div className="container">
            <h1 className="title">Soil Saint</h1>

            {/* Instructions Button */}
            <button className="instructions-btn" onClick={toggleModal}>Instructions</button>

            {/* Instructions Modal */}
            {showModal && (
                <div className="modal show" onClick={toggleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>Instructions</h2>
                        <p><strong>Instruction Guide for Using SoilSaint</strong></p>
                        <p>Welcome to SoilSaint! This application helps you find the best crops for your farm based on the characteristics of your land. To get the most accurate results, it’s important to describe your farm clearly.</p>
                        
                        <h3>How the Program Works</h3>
                        <p>SoilSaint matches crops based on farm conditions like soil type, climate, moisture content, and region. Based on your input, it generates an SQL query to pull crop data from the database.</p>

                        <h3>Writing the Best Input</h3>
                        <p>For accurate results, follow these guidelines:</p>

                        <ul>
                            <li><strong>Soil Type:</strong> Use one of the following soil types:
                                <ul>
                                    <li>Loamy</li>
                                    <li>Sandy</li>
                                    <li>Clay</li>
                                    <li>Silty</li>
                                    <li>Chalky</li>
                                    <li>Peaty</li>
                                </ul>
                                <em>Example</em>: “My farm has loamy soil.”
                            </li>
                            <li><strong>Climate:</strong> Use specific climate terms:
                                <ul>
                                    <li>Tropical</li>
                                    <li>Arid</li>
                                    <li>Temperate</li>
                                    <li>Humid</li>
                                    <li>Mediterranean</li>
                                </ul>
                                <em>Example</em>: “My farm has a tropical climate.”
                            </li>
                            <li><strong>Moisture Content:</strong> Use one of these moisture levels:
                                <ul>
                                    <li>High</li>
                                    <li>Medium</li>
                                    <li>Low</li>
                                </ul>
                                <em>Example</em>: “The moisture content on my farm is medium.”
                            </li>
                            <li><strong>Region:</strong> Specify the region your farm is located in:
                                <ul>
                                    <li>Southeast Asia</li>
                                    <li>North Africa</li>
                                    <li>North America</li>
                                    <li>South America</li>
                                    <li>Southern Europe</li>
                                    <li>Northern Europe</li>
                                    <li>Middle East</li>
                                    <li>Eastern Europe</li>
                                </ul>
                                <em>Example</em>: “My farm is located in South America.”
                            </li>
                        </ul>

                        <h3>Example Inputs</h3>
                        <ul>
                            <li>“My farm has loamy soil in a tropical climate with high moisture.”</li>
                            <li>“The soil is sandy, with low moisture, located in North Africa.”</li>
                            <li>“I live in a humid region with silty soil.”</li>
                        </ul>

                        <h3>Tips for Best Results</h3>
                        <p>Include soil type, climate, and moisture content. Specify the region where your farm is located. Use exact terms from the lists above (e.g., “loamy” instead of “loomy”). By following these tips, you’ll get the best crop recommendations for your farm.</p>

                        <p><strong>Happy farming!</strong></p>
                    </div>
                </div>
            )}

            {/* Search form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Details about your farm: e.g. loamy soil"
                />
                <button type="submit">Search</button>
            </form>

            {/* Social media and resume icons */}
            <div className="icon-container">
                <a href="https://www.linkedin.com/in/yusefbayyat" target="_blank" rel="noopener noreferrer">
                    <img src="/linkedin.png" alt="LinkedIn" />
                </a>
                <a href="https://www.github.com/yusefb" target="_blank" rel="noopener noreferrer">
                    <img src="/github.png" alt="GitHub" />
                </a>
                <a href="/BayyatYusefResume.pdf" target="_blank" rel="noopener noreferrer">
                    <img src="/resume5.png" alt="Resume" />
                </a>
            </div>

            {/* Result Modal */}
            {showResultModal && (
                <div className="modal show" onClick={closeResultModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={closeResultModal}>&times;</span>
                        <h2>Result</h2>
                        <p>{result}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
