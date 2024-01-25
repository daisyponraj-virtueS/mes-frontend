import '../../assets/styles/scss/components/toggleButton.scss'
const ToggleButton =({text,isChecked,onChange,style}:any)=>{
    return(
        <div className='toggle_button__switch_container' style={style}>
                    <label className='toggle_button__switch'>
                      <input type='checkbox' onChange={(e) => onChange(e.target.checked)} checked={isChecked}/>
                      <span className='toggle_button__slider parameters__round'></span>
                    </label>
                    <label className='toggle_button__switch_label' htmlFor='customSwitch1'>
                      {text}
                    </label>
                  </div>
    )
}

export default ToggleButton
