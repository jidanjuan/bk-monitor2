/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, provide, Ref, ref, watch } from 'vue';

import useResizeObserve from '../../../../hooks/use-resize-observe';
import { RowProxyData } from './log-row-attributes';

import './row-render.scss';

export default defineComponent({
  props: {
    rowIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots }) {
    const refRowNodeRoot: Ref<HTMLElement> = ref();
    const intersectionObserver: IntersectionObserver = inject('intersectionObserver');
    const rowProxy: Ref<RowProxyData> = inject('rowProxy');
    let isLeave = false;
    let isComponentMountedComplete = false;

    const visible = computed(() => {
      const { visible = true } = rowProxy.value[props.rowIndex] ?? {};
      const { start = 0, end = 50 }: { start: number; end: number } = (rowProxy.value ?? {}) as any;
      return visible || (props.rowIndex >= start && props.rowIndex <= end);
    });

    const isIntersecting = computed(() => rowProxy.value[props.rowIndex]?.visible ?? true);
    provide('isRowVisible', isIntersecting);

    const renderRowVNode = () => {
      return (
        <div data-row-index={props.rowIndex}>
          <div
            ref={refRowNodeRoot}
            class={['bklog-row-observe', { 'is-pending': !visible.value }]}
            data-row-index={props.rowIndex}
          >
            {visible.value ? slots.default?.() : ''}
          </div>
        </div>
      );
    };

    let mountedCompleteTimer;
    const setIsComponentMountedComplete = () => {
      mountedCompleteTimer && clearTimeout(mountedCompleteTimer);
      mountedCompleteTimer = setTimeout(() => {
        isComponentMountedComplete = true;
      }, 100);
    };

    const setParentElementHeight = () => {
      if (isLeave) {
        return;
      }

      if (refRowNodeRoot.value && refRowNodeRoot.value.offsetHeight > 0) {
        const target = refRowNodeRoot.value.parentElement;

        if (!isComponentMountedComplete) {
          if (target.hasAttribute('data-bklog-row-mounted')) {
            return;
          }

          target.setAttribute('data-bklog-row-mounted', 'true');
          setIsComponentMountedComplete();
        }

        target.style.setProperty('min-height', `${refRowNodeRoot.value.offsetHeight + 1}px`);
      }
    };

    const { observeElement, stopObserve, destoyResizeObserve } = useResizeObserve(
      refRowNodeRoot,
      () => {
        setParentElementHeight();
      },
      false,
    );

    watch(
      () => [visible.value],
      (val, old) => {
        if (val[0] !== old[0]) {
          isLeave = old[0] === true;
          if (val[0]) {
            observeElement();
            return;
          }

          stopObserve();
        }
      },
    );

    onMounted(() => {
      isComponentMountedComplete = false;
      intersectionObserver?.observe(refRowNodeRoot.value);
      setParentElementHeight();
    });

    onBeforeUnmount(() => {
      intersectionObserver?.unobserve(refRowNodeRoot.value);
      destoyResizeObserve();
    });

    return {
      renderRowVNode,
    };
  },
  render() {
    return this.renderRowVNode();
  },
});