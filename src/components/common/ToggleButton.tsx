import '../../assets/styles/scss/components/toggleButton.scss'
const ToggleButton =({text,isChecked,onChange,style, switchTwo=false}:any)=>{
    return(
        <div className={`${switchTwo?'toggle_button_two':'toggle_button'}__switch_container`} style={style}>
                    <label className={`${switchTwo?'toggle_button_two':'toggle_button'}__switch`}>
                      <input type='checkbox' onChange={(e) => onChange(e.target.checked)} checked={isChecked}/>
                      <span className={`${switchTwo?'toggle_button_two':'toggle_button'}__slider parameters__round`}></span>
                    </label>
                    <label className={`${switchTwo?'toggle_button_two':'toggle_button'}__switch_label`} htmlFor='customSwitch1'>
                      {text}
                    </label>
                  </div>
    )
}

export default ToggleButton
