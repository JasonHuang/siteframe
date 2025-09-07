/**
 * Default Layout Metadata - 默认布局元数据
 * 定义组件的配置选项和属性
 */

import { ComponentMeta } from '../../../../../../../lib/types/modern-theme';

const DefaultLayoutMeta: ComponentMeta = {
  name: 'DefaultLayout',
  displayName: '默认布局',
  description: '用于大部分页面的基础布局，包含头部、主要内容和底部区域',
  category: 'layout',
  props: {
    children: {
      type: 'node',
      required: true,
      description: '布局内的内容'
    },
    className: {
      type: 'string',
      required: false,
      description: '额外的CSS类名',
      default: ''
    }
  }
};

export default DefaultLayoutMeta;