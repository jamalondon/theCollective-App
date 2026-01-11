import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

const EntypoIcon = ({ name, size, color }) => {
	return <Entypo name={name} size={size} color={color} />;
};

const IoniconsIcon = ({ name, size, color }) => {
	return <Ionicons name={name} size={size} color={color} />;
};

const MaterialIcon = ({ name, size, color }) => {
	return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

const MaterialIconsIcon = ({ name, size, color }) => {
	return <MaterialIcons name={name} size={size} color={color} />;
};

const FontAwesome6Icon = ({ name, size, color }) => {
	return <FontAwesome6 name={name} size={size} color={color} />;
};

const FeatherIcon = ({ name, size, color }) => {
	return <Feather name={name} size={size} color={color} />;
};

export default {
	EntypoIcon,
	IoniconsIcon,
	MaterialIcon,
	MaterialIcons: MaterialIconsIcon,
	FontAwesome6: FontAwesome6Icon,
	FeatherIcon,
};
