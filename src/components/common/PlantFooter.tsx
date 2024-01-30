
const PlantFooter = ({ disabled = false, currentTab, onback }) => {
    const buttonText = currentTab === 1 ? 'Save & Continue' : 'Save Changes';
  return (
    <div
      style={{
        height: '60px',
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '16px',
        borderTop: '1px solid #CDD0D1',
      }}
    >
      <button
        onClick={() => onback()}
        type='button'
        style={{
          border: '1px solid #CDD0D1',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '4px',
          padding: '8px 16px 8px 16px',
          color: '#0D659E',
          backgroundColor: '#fff',
        }}
   
      >
        Cancel
      </button>
      <button
      type="submit"
        style={{
          marginRight: '30px',
          border: '1px solid #CDD0D1',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '4px',
          padding: '8px 16px 8px 16px',
          color: '#fff',
          backgroundColor: '#0D659E',
        }}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PlantFooter;
