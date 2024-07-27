import React, { useEffect, useState } from "react";

interface Profile {
    name: string;
    email: string;
}

const ProfileCard: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500 animate-pulse">Loading...</div>;
    }

    if (!profile) {
        return <div className="text-center text-red-500 font-semibold">Error loading profile</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Good afternoon, {profile.name}</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Settings</button>
            </div>
            <div className="text-center text-5xl font-bold text-gray-900 mb-8">$0.00</div>
            <div className="flex justify-center space-x-6 text-gray-700 mb-8">
                <span className="cursor-pointer hover:text-gray-900 text-lg">1W</span>
                <span className="cursor-pointer hover:text-gray-900 text-lg">1M</span>
                <span className="cursor-pointer hover:text-gray-900 text-lg">3M</span>
                <span className="cursor-pointer hover:text-gray-900 text-lg">6M</span>
                <span className="cursor-pointer hover:text-gray-900 text-lg">1Y</span>
                <span className="cursor-pointer hover:text-gray-900 text-lg">ALL</span>
            </div>
            <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
            <div className="flex justify-around">
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Buy</button>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Sell</button>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Convert</button>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Deposit</button>
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Withdraw</button>
            </div>
        </div>
    );
};

export default ProfileCard;
