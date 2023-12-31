import React from 'react';

const FormArtistDescription = ({ formData, updateFormData }) => {
  const handleInputChange = (e) => {
    const { value } = e.target;
    const updatedValues = formData['artistDescription'] || [];

    if (updatedValues.includes(value)) {
      const index = updatedValues.indexOf(value);
      updatedValues.splice(index, 1);
    } else {
      updatedValues.push(value);
    }

    updateFormData({ ...formData, ['artistDescription']: updatedValues });
  };

  const options = [
    'mysterious',
    'dark',
    'soulful',
    'colorful',
    'energetic',
    'elegant',
    'clean cut',
    'exotic',
    'experimental',
  ];

  return (
    <div className="page flex h-full flex-col items-center justify-center bg-white">
      <div className="flex w-full flex-col items-start px-6">
        <h1 className="mb-4 text-2xl font-bold text-[#42A5F5]">
          How would you describe yourself?
        </h1>
        <p className="pb-4 font-bold text-gray-400">
          Choose as many as you like
        </p>
        <div className="flex h-full w-full flex-wrap items-center justify-center">
          {options.map((option, index) => (
            <div
              key={index}
              className="mb-2 block flex items-center pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
            >
              <input
                type="checkbox"
                id={option}
                name="artistDescription"
                value={option}
                checked={(formData['artistDescription'] || []).includes(option)}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormArtistDescription;
