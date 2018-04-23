import React, { Fragment } from 'react';
import { connect } from 'dva';
import Authorized from '../utils/Authorized';
import { Table, Form, Input, Icon, Button,Layout } from 'antd';
import { Component} from 'react';
const FormItem = Form.Item;

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;

class BasicLayout extends React.PureComponent {
  render() {
    return (
        <Layout>
          <Content>
           <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem>
                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}  />
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
            <Table />
          </Content>
        </Layout>
    );
  }
}

export default connect(({}) => ({}))(BasicLayout);
