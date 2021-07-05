import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Container,
  Header,
  Main,
  Aside,
  Form,
  Input,
  FormItem,
  Message,
  Table,
  TableColumn,
  Tag,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tree,
  Select,
  Option,
  Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(Cascader)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
