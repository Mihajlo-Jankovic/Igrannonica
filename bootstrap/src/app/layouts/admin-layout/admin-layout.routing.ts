import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UploadComponent } from "../upload/upload.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "upload", component: UploadComponent },
  { path: "icons", component: IconsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "user", component: UserComponent },
  { path: "tables", component: TablesComponent },
  { path: "typography", component: TypographyComponent }
];
