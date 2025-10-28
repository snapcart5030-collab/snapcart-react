import Admin from './Admin';
import './HomePage.css'
import CarousalItem from './CarousalItem';
import CategoryPage from './CategoryPage';
import ConfirmOrderAdmin from './ConfirmOrderAdmin';
import FooterPage from './FooterPage';

function HomePage() {

  return (
    <div className=' container-fluid'>
     {/* <FooterPage/> */}
        <div className='only_category_for_pc_laptops_po'>
          <CategoryPage/>
        </div>
 
     <CarousalItem/>
           <ConfirmOrderAdmin/>
       <div>
        {/* footerbar import here */}
        <FooterPage/>
       </div>
    </div>
  );
}

export default HomePage;
