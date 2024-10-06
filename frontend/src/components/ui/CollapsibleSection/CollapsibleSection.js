import React, { useState } from 'react';
import styles from './CollapsibleSection.module.css';

const CollapsibleSection = ({ title, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className={styles.collapsibleSection}>
            <div className={styles.header} onClick={toggleOpen}>
                {isOpen ? `Hide ${title}` : `Show ${title}`}
            </div>
            {isOpen && <div className={styles.content}>{children}</div>}
        </div>
    );
};

export default CollapsibleSection;
