import { FC } from 'react';
import { isEmpty } from 'utils/utils';
import { useAppSelector } from 'store';
import Loading from 'components/common/Loading';
import 'assets/styles/scss/components/table-general.scss';
import ElementsTable2 from 'components/common/ElementsTable2';

type Props = {
  changeTab: () => void;
  isTabClicked?: boolean;
};
const WarningTolerances: FC<Props> = ({ changeTab, isTabClicked }) => {
  // const url = new URL(window.location.href);
  // const queryParams = new URLSearchParams(url.search);
  // const id = queryParams.get('id');

  const warningData = useAppSelector((state: any) => state.material.material) || [];

  const onSave = () => {
    changeTab();
  };

  return (
    <>
      <div className='mt-4'>
        {isEmpty(warningData.warning_tollerances_new) && !isTabClicked ? (
          <Loading />
        ) : (
          <ElementsTable2 showFloat={true} elements={warningData?.warning_tollerances_new} />
        )}
        <div className='mt-8'>
          {!isEmpty(warningData.auxillary_tollerances_new) && (
            <h3 className='text-black font-semibold'>Auxillary Elements Tolerances</h3>
          )}
          {!isEmpty(warningData.auxillary_tollerances_new) && (
            <div className='mt-4'>
              {isEmpty(warningData.auxillary_tollerances_new) ? (
                <Loading />
              ) : (
                <ElementsTable2
                  showFloat={true}
                  elements={warningData?.auxillary_tollerances_new}
                />
              )}
            </div>
          )}
        </div>
        {!isTabClicked && (
          <div className='dashboard__main__footer dashboard__main__footer--type2'>
            <div className='dashboard__main__footer__container'>
              {/* <button className="btn btn--h36 px-4 py-2">Cancel</button> */}
              <button className='btn btn--primary btn--h36 px-8 py-2 ml-4' onClick={onSave}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WarningTolerances;
