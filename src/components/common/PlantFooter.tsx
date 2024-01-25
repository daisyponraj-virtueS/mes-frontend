const PlantFooter = ({disabled=false}) => {
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
        Save Changes
      </button>
    </div>
  );
};

export default PlantFooter;
