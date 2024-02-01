import React, { useEffect, useState } from 'react';

const CustomSelect = ({
  options,
  onChange,
  index,
  disabled = false,
  searchText = '',
  search = false,
  value = 'Select',
  onClick = () => {},
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Select');
  const [selectedName, setSelectedName] = useState('Select');
  const [showTooltip, setShowTooltip] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(options);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onClick(true);
  };

  const handleOptionClick = (value: any, valueName: any) => {
    if (value == 'Select') {
      onChange('');
    } else {
      onChange(value);
    }
    setSelectedValue(value);
    setSelectedName(valueName);

    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedName(value);
  }, [value]);

  const handleSearch = (event:any) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = options.filter((item :any) =>
      item.option.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredData(filtered);
  };

  useEffect(()=>{
    setFilteredData(options);
  },[options])
  return (
    <div
      className='custom-select'
      style={{
        height: '40px',
        overflow: 'visible',
        backgroundColor: disabled ? '#CDD0D1' : 'white',
      }}
    >
      <div
        onClick={handleToggle}
        style={{
          height: '40px',
          border: '1px solid #CDCDCD',
          padding: '10.5px 12px 10.5px 12px',
          borderRadius: '4px',
          borderBottomLeftRadius: isOpen ? '0px' : '4px',
          borderBottomRightRadius: isOpen ? '0px' : '4px',
          color: selectedName == 'Select' || selectedName == 'Select ' ? '#757E85' : 'black',
        }}
        onMouseOver={() => setShowTooltip(index)}
        onMouseOut={() => setShowTooltip('')}
      >
        <div
          style={{
            fontSize: '14px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '80%',
          }}
        >
          {selectedName}
        </div>
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', bottom: '11px', left: '92%' }}
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-chevron-down'
            viewBox='0 0 16 16'
          >
            <path
              fill-rule='evenodd'
              d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708'
            />
          </svg>
        </div>
        {showTooltip === index && selectedName != 'Select' && selectedName?.length > 27 ? (
          <p
            style={{
              position: 'relative',
              bottom: '75px',
              right: '0px',
              backgroundColor: 'gray',
              padding: '5px',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '4px',
              zIndex: '999999',
              width: 'max-content',
            }}
          >
            {selectedName}
          </p>
        ) : (
          ''
        )}
      </div>
      {isOpen && filteredData?.length > 0 && !disabled && (
        <ul
          className='options-list'
          style={{
            border: '1px solid #CDCDCD',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            borderTop: '0px',
            position: 'relative',
            backgroundColor: '#fff',
            zIndex: '99999',
            maxHeight: '220px',
            overflow: 'auto',
            boxShadow: '4px 16px 24px 0px #7A7A7A40',
          }}
        >
          {search ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  style={{ margin: '12px' }}
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-search'
                  viewBox='0 0 16 16'
                >
                  <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0' />
                </svg>
                <input placeholder={searchText} value={searchTerm} onChange={handleSearch} style={{ padding: '12px', fontSize: '14px',border:0 }} />
              </div>
              <hr style={{ margin: '0px' }} />
            </div>
          ) : (
            ''
          )}
          {filteredData.map((option: any, index: any) => (
            <li
              key={option?.option}
              onMouseOver={() => setMouseOver(index)}
              onMouseOut={() => setMouseOver('')}
              onClick={() => handleOptionClick(option?.value, option?.option)}
              style={{
                padding: '8px 12px 8px 12px',
                fontSize: '14px',
                backgroundColor: mouseOver === index ? '#0D659E' : 'white',
                color: mouseOver === index ? 'white' : 'black',
                transform: '2s',
              }}
            >
              {option?.option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
