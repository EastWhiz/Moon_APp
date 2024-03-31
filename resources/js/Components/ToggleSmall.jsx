import { useState } from 'react'
import "@/Components/ToggleSmall.css";
import React from "react";
export const Toggle = ({ label, toggled, onClick, disabled }) => {

  // console.log(disabled);

    return (
        <div id='customToggleTwo'>
            <label>
                {/* checked is the real setup */}
                <input type="checkbox" checked={toggled} onChange={onClick} disabled={disabled} />
                <span style={disabled ? { backgroundColor: 'rgb(149, 151, 151)' } : {}} />
                <strong>{label}</strong>
            </label>
        </div>
    )
}
export default Toggle;
