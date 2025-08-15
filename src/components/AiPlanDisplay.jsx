import React, { useState, useEffect, useMemo } from 'react';

// A sub-component to render the structured content of each section
const SectionContent = ({ content }) => {
  const structuredContent = useMemo(() => {
    if (!content) return [];
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const elements = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 pl-4 mb-3">{listItems}</ul>);
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('###')) {
        flushList();
        elements.push(<h4 key={index} className="text-md font-bold text-gray-800 mt-3 mb-1">{line.replace('###', '').trim()}</h4>);
      } else if (line.trim().startsWith('*')) {
        listItems.push(<li key={index} className="text-sm text-gray-600">{line.replace('*', '').trim()}</li>);
      } else {
        flushList();
        elements.push(<p key={index} className="text-sm text-gray-600 mb-2">{line.trim()}</p>);
      }
    });

    flushList();
    return elements;
  }, [content]);

  return <div>{structuredContent}</div>;
};

// A new sub-component for each animated accordion item
const AccordionSection = ({ section, index, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-in-out opacity-0 translate-y-4 fade-in-item" style={{ transitionDelay: `${index * 100}ms` }}>
      <button
        onClick={onToggle}
        className="w-full p-4 font-semibold text-left flex justify-between items-center transition hover:bg-slate-50 focus:outline-none"
      >
        {section.title}
        <svg className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="p-4 border-t border-gray-200">
          <SectionContent content={section.content} />
        </div>
      </div>
    </div>
  );
};

const AiPlanDisplay = ({ planText }) => {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState([]);
  const [openIndex, setOpenIndex] = useState(0); // Keep the first section open by default

  useEffect(() => {
    if (!planText) {
      setSections([]); // Clear sections if there is no plan
      return;
    }

    const lines = planText.split('\n').filter(line => line.trim() !== '');
    const mainTitle = lines.find(line => line.startsWith('# '))?.replace('# ', '') || 'Your Generated Plan';
    setTitle(mainTitle);

    const sectionStartIndices = lines.reduce((acc, line, index) => {
      if (line.startsWith('## ')) acc.push(index);
      return acc;
    }, []);

    const parsedSections = sectionStartIndices.map((startIndex, i) => {
      const endIndex = i < sectionStartIndices.length - 1 ? sectionStartIndices[i + 1] : lines.length;
      const sectionLines = lines.slice(startIndex, endIndex);
      
      return {
        title: sectionLines[0].replace('## ', ''),
        content: sectionLines.slice(1).join('\n'),
      };
    });

    setSections(parsedSections);
    setOpenIndex(0);

    // This timeout ensures the animation re-triggers when the planText changes
    setTimeout(() => {
      const items = document.querySelectorAll('.fade-in-item');
      // Reset animation classes before applying them
      items.forEach(el => {
        el.classList.add('opacity-0', 'translate-y-4');
      });
      // Apply animation classes
      items.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-4');
        }, (index + 1) * 100); // Stagger the animation
      });
    }, 50);

  }, [planText]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-4 p-4 bg-slate-100 rounded-lg border text-gray-800 space-y-2">
      <h3 className="text-xl font-bold text-center mb-3">{title}</h3>
      {sections.map((section, index) => (
        <AccordionSection
          key={index}
          section={section}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default AiPlanDisplay;
