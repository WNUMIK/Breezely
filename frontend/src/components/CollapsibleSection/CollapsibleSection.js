import React, { useState } from 'react';
import './CollapsibleSection.css';  // For custom styles

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-section">
            <div className="header" onClick={toggleSection}>
                <h3>{title}</h3>
                <button>{isOpen ? "Hide" : "Show"}</button>
            </div>
            {isOpen && <div className="content">{children}</div>}
        </div>
    );
};

export default CollapsibleSection;
