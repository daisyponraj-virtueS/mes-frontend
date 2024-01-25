import 'assets/styles/scss/components/accordion.scss'
const Accordion = ({title,children}: any)=>{

  console.log("accTitle",title)

    const identifier = title?.split(' ').join('')
    return(

        <div className="accordion " id={`${identifier}cl`} >
  <div className="accordion-item" >
    <h2 className="accordion-header" >
      <button className="accordion-button" style={{fontWeight:600,backgroundColor: '#F5F8FA',padding:'9px 16px 9px 16px',color:'#04436B'}} type="button" data-bs-toggle="collapse" data-bs-target={`#${identifier}`} aria-expanded="true" aria-controls="flush-collapseOne">
       {title}
      </button>
    </h2>
    <div id={identifier} className="accordion-collapse collapse show" data-bs-parent={`#${identifier}cl`} >
      <div className="accordion-body" style={{paddingRight:'34px', paddingLeft:'34px'}}>
        {children}
      </div>
    </div>
  </div>
</div>
    )
}

export default Accordion

