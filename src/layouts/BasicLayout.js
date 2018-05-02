import React, { Fragment } from 'react';
import { connect } from 'dva';
import Authorized from '../utils/Authorized';
import { Table, Form, Input, Icon, Button,Layout } from 'antd';
import { Component} from 'react';
// import { ipcRenderer } from "electron";
const FormItem = Form.Item;
const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;
const {ipcRenderer} = global.electron
//id	desc	assigned	reporter	cc	version	platform	sys	dependson	blocked	link	creation_ts	modified	commname	commtext	difflink	newdiff	filename
class BasicLayout extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = props;
        this.columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width:"100px",
            render:(text, record)=>{
                return <a  onClick={() => {
                    ipcRenderer.send('show-png', record);

                }}>{text}</a>;
            }
        }, {
            title: 'desc',
            dataIndex: 'desc',
            key: 'desc',
        },{
          title: 'assigned',
          dataIndex: 'assigned',
          key: 'assigned',
        }, {
          title: 'reporter',
          dataIndex: 'reporter',
          key: 'reporter',
        }, {
          title: 'cc',
          dataIndex: 'cc',
          key: 'cc',
          width:"120px"
        },{
            title: 'platform',
            dataIndex: 'platform',
            key: 'platform',
            width:"120px"
        },{
            title: 'sys',
            dataIndex: 'sys',
            key: 'sys',
            width:"120px"
        }];
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            ipcRenderer.send('click', values)
        })
    }
  render() {
    const {getFieldDecorator} = this.state.form
    if(!this.state.bug){
        ipcRenderer.send('bug-data', null);
        ipcRenderer.on('bug-data', (event, arg)=>{
            console.log(arg)
            this.setState({bug:arg})
        })
    }

    return (
        <Layout>
          <Content>
           <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem>
                        {getFieldDecorator('id', {})(
                            <Input placeholder="请输入BUG id" prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}  />
                        )}
                </FormItem>
                <FormItem>
                <Button
                    type="primary"
                    htmlType="submit"
                >
                    + Search
                </Button>
                </FormItem>
            </Form>
            <Table columns={this.columns} pagination={true} dataSource={this.state.bug} />
          </Content>
        </Layout>
    );
  }
}
export default connect(({}) => ({}))(Form.create()(BasicLayout));
