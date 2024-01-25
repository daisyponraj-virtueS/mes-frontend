import '../../assets/styles/scss/components/inputField.scss'

const InputField = ({ icon = null,onChange,value,name,handleBlur }:any) => {
  return (
    <div className='input_field__input_container input-group mb-3'>
      <input type='text' className='input_field__input form-control' style={{ borderRight:icon ?"0px": '1px solid #cdd0d1'}} name={name} onBlur={handleBlur} value={value} onChange={(e)=>onChange(e.target.value)} placeholder='Enter Value' />
      {icon ? (
        <div className='input-group-append'>
          <span className='input_field__input_icon input-group-text'>{icon}</span>
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
