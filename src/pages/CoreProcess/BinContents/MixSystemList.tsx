import 'assets/styles/scss/components/cards.scss';
import { useEffect, useState } from 'react';
import httpClient from 'http/httpClient';
import Loading from 'components/common/Loading';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import { trimAndEllipsis } from 'utils/utils';
const MixSystemList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [mixSystem, setMixSystem] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    getListData();
  }, []);
  const getListData = async () => {
    const response = await httpClient.get(`/api/mixsystem/`);
    console.log(response);
    setStates(response);
  };
  const setStates = (response: any) => {
    setMixSystem(response.data.results);
    setLoading(false);
  };
  const handleNavigation = (e: any) => {
    if (e?.no_of_bins <= 0) {
      return;
    } else {
      navigate(`${paths.binContenets.view}?id=${e?.id}`);
    }
  };
  if (loading) return <Loading />;

  return (
    <>
      <DashboardAddtivieHeader
        title={`Bin Contents`}
        // onBackClick={handleBackClick}
      />
      <div className='dashboard__main__body px-8 py-6'>
        {!isEmpty(mixSystem) ? (
          mixSystem.map((e: any) => (
            <div
              onClick={() => handleNavigation(e)}
              className={`mixsystemcard ${
                e?.no_of_bins >= 1 ? 'mixsystemcard__clickable_item' : ''
              }`}
            >
              <h1 className='mixsystemcard__header furnace_title'>
                {trimAndEllipsis(e?.title, 20)}
              </h1>
              <div className='mixsystemcard_body'>
                <div className='mixsystemcard_body_furnancegroup'>
                  <h2 className='heading'>Furnaces</h2>
                  <div className='furnance-labels'>
                    {e.furnace.map((furnace_item: { furnace_name: string; is_active: boolean }) => (
                      <div className={furnace_item?.is_active ? 'numbers' : 'grey_numbers'}>
                        {furnace_item?.furnace_name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='mixsystemcard_body_bins'>
                  <h2 className='key'>No Of Bins</h2>
                  <h2 className='value'>{e?.no_of_bins}</h2>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
        )}
      </div>
    </>
  );
};
export default MixSystemList;
