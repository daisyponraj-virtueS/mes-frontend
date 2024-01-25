import { FC, useState, useEffect } from 'react';
import { useAppDispatch } from 'store';
import '../../../assets/styles/scss/components/table-general.scss';
// import { useNavigate } from 'react-router-dom';
import { getCustomerDetails } from 'store/slices/customerSlice';
import ElementsTable2 from 'components/common/ElementsTable2';
import { isEmpty } from 'utils/utils';
import 'assets/styles/scss/components/table-general.scss';
import Loading from 'components/common/Loading';

type props = {
  changeTab: (e: any) => void;
};

const CustomerWarningTollerances: FC<props> = ({ changeTab }) => {
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  // const editValue = queryParams.get('edit');
  // const [isEdit, setIsEdit] = useState(editValue === 'true');
  // const navigate = useNavigate();
  const [warningData, setWarningTollerances] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getWarningToollerance = async () => {
    setIsLoading(true);
    const responseData = await dispatch(getCustomerDetails(id));
    const responseObj = responseData.payload.data;
    setWarningTollerances(responseObj);
    setIsLoading(false);
  };

  useEffect(() => {
    getWarningToollerance();
  }, [id]);
  // const handleBackClick = () => {
  //   navigate(`${paths.dashboardMaterialMaintenance}`);
  // };

  const onSave = () => {
    changeTab(4);
  };

  return (
    <>
      <div className='mt-4'>
        {isLoading && <Loading />}
        {!isEmpty(warningData.warning_tollerances_new) && (
          <ElementsTable2 showFloat={true} elements={warningData?.warning_tollerances_new} />
        )}
        <div className='mt-8'>
          {!isEmpty(warningData.auxillary_tollerances_new) && (
            <h3 className='text-black font-semibold'>Auxillary Elements Tolerances</h3>
          )}
          {warningData.auxillary_tollerances_new && (
            <div className='mt-4'>
              {!isEmpty(warningData.auxillary_tollerances_new) && (
                <ElementsTable2
                  showFloat={true}
                  elements={warningData?.auxillary_tollerances_new}
                />
              )}
            </div>
          )}
        </div>
        {
          <div className='dashboard__main__footer dashboard__main__footer--type2'>
            <div className='dashboard__main__footer__container'>
              {/* <button className="btn btn--h36 px-4 py-2" onClick={editScreen}>
              Cancel
            </button> */}
              <button
                className={`btn btn--primary btn--h36 px-8 py-2 ml-4`}
                //${
                //   hasErrors || errorInAux ? 'btn--primary disabled' : ''
                // }`}
                onClick={onSave}
                // disabled={hasErrors || errorInAux}
              >
                Continue
              </button>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default CustomerWarningTollerances;
