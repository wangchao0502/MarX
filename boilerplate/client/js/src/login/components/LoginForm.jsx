import React, { Component } from 'react';
import { Link } from 'react-router';
import ajax from 'superagent';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  message,
} from 'antd';

const FormItem = Form.Item;
const MESSAGE_DURING = 5;

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((formError, values) => {
      if (!formError) {
        this.setState({ loading: true });
        ajax
          .post('/login')
          .send(values)
          .end((resError, res) => {
            if (resError || (res.body && res.body.code !== 0)) {
              message.error(resError || res.body.msg, MESSAGE_DURING);
            } else {
              window.location.href = '/';
            }
            this.setState({ loading: false });
          });
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>,
          )}
          <a className="login-form-forgot">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </FormItem>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;
