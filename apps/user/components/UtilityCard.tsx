
import React from 'react';

const UtilityCard = ({ name, imageUrl }: {
    name: string, imageUrl: string
}) => {
    return (
        <div className="rounded-lg shadow-lg overflow-hidden bg-white">
            <img src={imageUrl} alt={name} className="w-32 h-32 object-cover" />
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{name}</h2>
            </div>
        </div>
    );
};

export default UtilityCard;
