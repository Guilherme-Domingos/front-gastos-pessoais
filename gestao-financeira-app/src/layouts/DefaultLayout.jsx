import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import style from '../App.module.css';

export function DefaultLayout({ children, pageTitle }) {
  return (
    <div className={style.container}>
      <div className={style.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={style.mainContent}>
        <div className={style.headerWrapper}>
          <Header title={pageTitle} />
        </div>
        <div className={style.content}>
          {children}
        </div>
      </div>
    </div>
  );
}