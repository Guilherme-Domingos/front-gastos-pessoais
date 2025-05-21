import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import style from '../App.module.css';

export function DefaultLayout({ children }) {
  return (
    <div className={style.container}>
      <div className={style.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={style.mainContent}>
        <div className={style.headerWrapper}>
          <Header title={'Dashboard'} />
        </div>
        <div className={style.content}>
          {children}
        </div>
      </div>
    </div>
  );
}