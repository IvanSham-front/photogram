import React from "react";
import IconsSVG from './icons.svg';

function Icons ({name, color, size, className}) {
    return (
        <svg className={`icon icon-${name} ${className}`} fill={color} width={size} height={size}>
             <use href={`${IconsSVG}#${name}`} />
        </svg>
    )
}

export default Icons;