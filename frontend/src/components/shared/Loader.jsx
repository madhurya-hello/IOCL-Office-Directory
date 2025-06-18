import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for the rotation animation
const rotate = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

// Pulse animation for the background
const pulse = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Updated dots animation - sequential appearance with persistence
const appear = keyframes`
  0%, 25% { opacity: 0; }
  8.33% { opacity: 1; }
  16.66% { opacity: 1; }
  25%, 100% { opacity: 0; }
`;

// Styled loader component
const LoaderContainer = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  margin: 0 auto;

  &:before, &:after {
    content: '';
    border-radius: 50%;
    position: absolute;
    inset: 0;
  }

  &:before {
    box-shadow: 
      0 0 15px 5px rgba(255, 255, 255, 0.8) inset,
      0 0 20px 10px rgba(255, 255, 255, 0.3);
  }

  &:after {
    border: 4px solid transparent;
    border-top-color: ${props => props.color};
    border-right-color: ${props => props.color};
    animation: ${rotate} 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    filter: drop-shadow(0 0 8px ${props => props.color}80);
  }
`;

const FullPageLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    135deg,
    #f5f7fa 0%,
    rgb(181, 198, 233) 25%,
    rgb(165, 206, 238) 50%,
    rgb(214, 224, 243) 75%,
    #f5f7fa 100%
  );
  background-size: 400% 400%;
  animation: ${pulse} 8s ease infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 30px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 2.1rem;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 550;
  opacity: 0.8;
`;

const Dot = styled.span`
  display: inline-block;
  margin: 0 2px;
  opacity: 0;
  animation: ${appear} 2.4s infinite ease-in-out;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.8s;
  }
  &:nth-child(3) {
    animation-delay: 1.6s;
  }
`;

const Loader = ({ 
  size = 140, 
  color = "#4f46e5",
  message = "Loading" 
}) => {
  return (
    <FullPageLoader>
      <LoaderContainer size={size} color={color} />
      <LoadingText>
        {message}
        <Dot>.</Dot>
        <Dot>.</Dot>
        <Dot>.</Dot>
      </LoadingText>
    </FullPageLoader>
  );
};

export default Loader;