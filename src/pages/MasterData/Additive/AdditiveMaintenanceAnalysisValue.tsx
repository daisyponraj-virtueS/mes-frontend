import { FC, useState, useEffect } from 'react';
import { useAppDispatch } from 'store';
import { getAdditiveDetails } from 'store/slices/additiveSlice';

const AdditiveMaintenanceAnalysisValue: FC = () => {
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const [firstHalfObject, setFirstHalfObject] = useState<any>({});
  const [secondHalfObject, setSecondHalfObject] = useState({});

  const getAdditive = async () => {
    const responseData = await dispatch(getAdditiveDetails(id));
    const responseObj = responseData.payload.data.specs_new;
    const objectArray = Object.entries(responseObj);
    const midpoint = Math.ceil(objectArray.length / 2);
    const firstHalf = objectArray.slice(0, midpoint);
    const secondHalf = objectArray.slice(midpoint);
    setFirstHalfObject(Object.fromEntries(firstHalf));
    setSecondHalfObject(Object.fromEntries(secondHalf));
  };

  useEffect(() => {
    getAdditive();
  }, [id]);

  const table = (mapingObject: {}) => {
    return (
      <div className='col-5 px-6'>
        <table className='table-analysis table-analysis--type2' style={{ width: 'initial' }}>
          <tbody>
            {Object.entries(mapingObject).map(([element, value]: any) => {
              return tableRow(element, value);
            })}
          </tbody>
        </table>
      </div>
    );
  };
  const tableRow = (label: string, value: number) => {
    return (
      <tr>
        <td>
          <div className='table-analysis__content'>
            <div className='table-analysis__label'>{label}</div>
            <p className='table-analysis__desc table-analysis__desc--border ml-4'>{value}</p>
          </div>
        </td>
      </tr>
    );
  };
  return (
    <div className='tab-body px-6 pt-4 pb-16'>
      <div className='table-analysis-wrapper mt-4'>
        <div className='table-analysis__header'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-medium'>Analysis Values</h3>
          </div>
        </div>
        <div className='table-analysis__body mt-4'>
          <div className='flex -mx-6'>
            {table(firstHalfObject)}
            {table(secondHalfObject)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditiveMaintenanceAnalysisValue;
