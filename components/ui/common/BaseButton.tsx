"use client"
import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface BaseButtonProps extends ButtonProps {
    label: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({ label, ...props }) => {
    return (
        <Button
            colorScheme="teal"
            size="md"
            borderRadius="md"
            {...props}
            variant="surface"
        >
            {label}
        </Button>
    );
};

export default BaseButton;