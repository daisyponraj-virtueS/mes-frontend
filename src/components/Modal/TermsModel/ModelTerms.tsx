import { FC } from 'react';
import closeIcon from '../../../assets/icons/close-btn.svg';
import './style.scss'

interface ModalTermsProps {
  showModal: boolean;
  closeModel: () => void;
}

const ModalTermsOfUse: FC<ModalTermsProps> = ({ showModal, closeModel }) => {

  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-8">
              <h3 className="modal__title">Terms Of Use</h3>
            </div>
            <div className="modal__close" onClick={closeModel}>
              <img src={closeIcon} alt="close-icon" />
            </div>
          </div>
        </div>
       <div className='list-container'>
        <ol >
          <li>1. Introduction
            <p>This website is operated by [Merchant Name]. The terms "we", "us", and "our" refer to [Merchant Name]. The use of our website is subject to
the following terms and conditions of use, as amended from time to time (the "Terms"). The Terms are to be read together by you with any
terms, conditions or disclaimers provided in the pages of our website. Please review the Terms carefully. The Terms apply to all users of our
website, including without limitation, users who are browsers, customers, merchants, vendors and/or contributors of content. If you access
and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to the
Terms or our Privacy Policy, you are not authorized to access our website, use any of our website's services or place an order on our
website.</p>
          </li>
          <li>2. Use of our Website
            <p>You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including without limitation, in violation
of any intellectual property or privacy law. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in
your state or province of residence and are legally capable of entering into a binding contract.
You agree to not use our website to conduct any activity that would constitute a civil or criminal offence or violate any law. You agree not to
attempt to interfere with our website's network or security features or to gain unauthorized access to our systems.
You agree to provide us with accurate personal information, such as your email address, mailing address and other contact details in order
to complete your order or contact you as needed. You agree to promptly update your account and information. You authorize us to collect
and use this information to contact you in accordance with our Privacy Policy.</p>
          </li>
        </ol>
       
       </div>
      </div>
    </section>
  );
};

export default ModalTermsOfUse;
