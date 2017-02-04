import React, { Component } from 'react';
import { Link } from 'react-router';
import ajax from 'superagent';
import {
  Form,
  Icon,
  Input,
  Button,
  message,
} from 'antd';

const FormItem = Form.Item;
const MESSAGE_DURING = 5;

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      passwordDirty: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((formError, values) => {
      if (!formError) {
        this.setState({ loading: true });
        ajax
          .post('/register')
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

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords is inconsistent!');
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className="register-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Please input your Password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true,
              message: 'Please confirm your Password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password Confirm" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
            Register
          </Button>
          Or <Link to="/login">login now!</Link>
        </FormItem>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;
