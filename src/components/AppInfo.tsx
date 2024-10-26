import React from 'react';
import './AppInfo.css'; // Stylizujesz komponent osobnym plikiem CSS

const AppInfo = () => {
    return (
        <div className="app-info">
            <h2>About ControlFood</h2>
            <p>ControllFood helps you manage your food allergies and dietary preferences easily.
                Keep track of the ingredients you need to avoid, discover suitable recipes,
                and enjoy a personalized dining experience.</p>

            <div className="features">
                <div className="feature-item">
                    <i className="fas fa-utensils"></i> {/* Ikona z FontAwesome */}
                    <h3>Track Ingredients</h3>
                    <p>Easily track ingredients in your meals to avoid allergens.</p>
                </div>
                <div className="feature-item">
                    <i className="fas fa-heart"></i> {/* Ikona */}
                    <h3>Personalized Diet</h3>
                    <p>Get personalized food suggestions based on your preferences.</p>
                </div>
                <div className="feature-item">
                    <i className="fas fa-clipboard-list"></i> {/* Ikona */}
                    <h3>Customizable Plans</h3>
                    <p>Set your dietary goals and let us help you stick to them.</p>
                </div>
            </div>
        </div>
    );
};

export default AppInfo;
