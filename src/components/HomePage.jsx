import './HomePage.css'
import CarousalItem from './CarousalItem';
import CategoryPage from './CategoryPage';
import FooterPage from './FooterPage';

function HomePage() {

  return (
    <div className=''>
      {/* <FooterPage/> */}
      <div className='only_category_for_pc_laptops_po'>
        <CategoryPage />
      </div>

      <CarousalItem />

      <div>
        {/* footerbar import here */}
        <FooterPage />
      </div>
    </div>
  );
}

export default HomePage;
