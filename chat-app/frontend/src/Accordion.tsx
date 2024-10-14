import React, { useState, ReactNode } from "react";
import "./Accordion.css"; // Custom styles

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container">
      <div onClick={toggleAccordion} className="accordion-gear-toggle">
        <i className={`fas fa-cog ${isOpen ? "spin" : ""}`}></i>
      </div>
      <div className={`accordion-content ${isOpen ? "expanded" : "collapsed"}`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
