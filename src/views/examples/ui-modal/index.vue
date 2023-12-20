<script setup>
  import { getCurrentInstance, ref } from 'vue';

  defineOptions({
    name: 'examples-ui-modal',
  });
  let visible1 = ref(false);
  const test = ref(0);
  const { proxy } = getCurrentInstance();
  const formRef = ref(null);

  const formValidate = ref({
    name: 'aaa',
    mail: '',
    city: 'beijing',
    gender: 'male',
    interest: ['Eat'],
    date: '',
    time: '',
    desc: '',
  });
  const ruleValidate = {
    name: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
    mail: [
      { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
      { type: 'email', message: 'Incorrect email format', trigger: 'blur' },
    ],
    city: [{ required: true, message: 'Please select the city', trigger: 'change' }],
    gender: [{ required: true, message: 'Please select gender', trigger: 'change' }],
    interest: [
      {
        required: true,
        type: 'array',
        min: 1,
        message: 'Choose at least one hobby',
        trigger: 'change',
      },
      {
        type: 'array',
        max: 2,
        message: 'Choose two hobbies at best',
        trigger: 'change',
      },
    ],
    date: [
      {
        required: true,
        type: 'date',
        message: 'Please select the date',
        trigger: 'change',
      },
    ],
    time: [
      {
        required: true,
        type: 'string',
        message: 'Please select time',
        trigger: 'change',
      },
    ],
    desc: [
      {
        required: true,
        message: 'Please enter a personal introduction',
        trigger: 'blur',
      },
      {
        type: 'string',
        min: 20,
        message: 'Introduce no less than 20 words',
        trigger: 'blur',
      },
    ],
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Age',
      key: 'age',
      width: 1000,
    },
    {
      title: 'Age',
      key: 'age',
      width: 1000,
    },
    {
      title: 'Age',
      key: 'age',
      width: 1000,
    },
    {
      title: 'Age',
      key: 'age',
      width: 1000,
    },
    {
      title: 'Address',
      key: 'address',
      fixed: 'right',
      width: 200,
    },
  ];
  const data = [
    {
      name: 'John Brown',
      age: 18,
      address: 'New York No. 1 Lake Park',
      date: '2016-10-03',
    },
    {
      name: 'Jim Green',
      age: 24,
      address: 'London No. 1 Lake Park',
      date: '2016-10-01',
    },
    {
      name: 'Joe Black',
      age: 30,
      address: 'Sydney No. 1 Lake Park',
      date: '2016-10-02',
    },
    {
      name: 'Jon Snow',
      age: 26,
      address: 'Ottawa No. 2 Lake Park',
      date: '2016-10-04',
    },
  ];

  const treeData = [
    {
      label: 'Level one 1',
      children: [
        {
          label: 'Level two 1-1',
          children: [
            {
              label: 'Level three 1-1-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 2',
      children: [
        {
          label: 'Level two 2-1',
          children: [
            {
              label: 'Level three 2-1-1',
            },
          ],
        },
        {
          label: 'Level two 2-2',
          children: [
            {
              label: 'Level three 2-2-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 3',
      children: [
        {
          label: 'Level two 3-1',
          children: [
            {
              label: 'Level three 3-1-1',
            },
          ],
        },
        {
          label: 'Level two 3-2',
          children: [
            {
              label: 'Level three 3-2-1',
            },
          ],
        },
      ],
    },
  ];

  const defaultProps = {
    children: 'children',
    label: 'label',
  };

  function show() {
    visible1.value = true;
  }

  function onCancel() {
    console.log('cancel');
  }

  function handleSubmit() {
    formRef.value.validate((valid) => {
      if (valid) {
        proxy.$Message.success('Success!');
      } else {
        proxy.$Message.error('Fail!');
      }
    });
  }
  function handleReset() {
    formRef.value.resetFields();
  }
</script>

<template>
  <div v-ui-loading="{ loading: false }">
    <Button
      @click="show"
      v-permission="{
        route: 'detectionresult',
        permission: 'statisticalresult',
      }"
      v-clickoutside="onCancel"
      >test</Button
    >
    <ui-modal v-model="visible1" @onCancel="onCancel" />
    <Input v-model="test" disabled placeholder="请输入" />
    <InputNumber :max="10" :min="1" disabled v-model="test" />
    <Form ref="formRef" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="Name" prop="name">
        <Input v-model="formValidate.name" disabled placeholder="Enter your name" />
      </FormItem>
      <FormItem label="E-mail" prop="mail">
        <Input v-model="formValidate.mail" placeholder="Enter your e-mail" />
      </FormItem>
      <FormItem label="City" prop="city">
        <Select
          v-model="formValidate.city"
          placeholder="Select your city"
          transfer
          filterable
          disabled
        >
          <Option value="beijing">New York</Option>
          <Option value="shanghai">London</Option>
          <Option value="shenzhen">Sydney</Option>
        </Select>
      </FormItem>
      <FormItem label="Date">
        <Row>
          <Col span="11">
            <FormItem prop="date">
              <DatePicker
                type="date"
                placeholder="Select date"
                v-model="formValidate.date"
                confirm
              />
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <FormItem prop="time">
              <TimePicker
                type="time"
                placeholder="Select time"
                v-model="formValidate.time"
                transfer
                confirm
              />
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="Gender" prop="gender">
        <RadioGroup v-model="formValidate.gender">
          <Radio label="male" disabled>Male</Radio>
          <Radio label="female">Female</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Hobby" prop="interest">
        <CheckboxGroup v-model="formValidate.interest">
          <Checkbox label="Eat" disabled />
          <Checkbox label="Sleep" disabled />
          <Checkbox label="Run" />
          <Checkbox label="Movie" />
        </CheckboxGroup>
      </FormItem>
      <FormItem label="Desc" prop="desc">
        <Switch />
      </FormItem>
      <FormItem>
        <Button type="text" v-debounce:click="handleSubmit">Submit</Button>
        <Button @click="handleReset" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
    <Table :columns="columns" :data="data" stripe />
    <el-tree :data="treeData" :props="defaultProps" />
  </div>
</template>

<style scoped></style>
