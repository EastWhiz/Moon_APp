import React from 'react';
import './ToggleSwitch.css';

export const ToggleSwitch = ({ toggled, onClick, label }) => {
    return (
        <div className={`roboto-regular toggle-container ${toggled ? 'on' : 'off'}`} onClick={onClick}>
            {/* Text container */}
            <div className="toggle-text-container">
                <span className="toggle-text toggle-text-on">Anzeigen</span>
                <span className="toggle-text toggle-text-off">Ausblenden</span>
            </div>

            {/* Toggle button */}
            <div className={`toggle ${toggled ? 'on' : 'off'}`}></div>
            {label && <strong>{label}</strong>}
        </div>
    );
};

export default ToggleSwitch;
