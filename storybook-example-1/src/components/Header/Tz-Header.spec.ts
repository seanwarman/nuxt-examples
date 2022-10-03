import { mount, VueWrapper } from '@vue/test-utils'
import TzHeader from './Tz-Header.vue'
import { expect, describe, it, beforeEach } from 'vitest'

let wrapper: VueWrapper

describe('SiteHeader.vue setup', () => {
    beforeEach(() => {
        wrapper = mount(TzHeader, {
            props: {},
            slots: {},
        })
    })

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot()
    })

    it('emits a logo clicked event', async () => {
        const element = wrapper.find('header div:first-child')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick() // wait until $emits have been handled
        expect(wrapper.emitted().menuClicked).toBeTruthy()
    })

    it('emits a logo clicked event', async () => {
        const element = wrapper.find('header div:nth-child(2)')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick() // wait until $emits have been handled
        expect(wrapper.emitted().logoClicked).toBeTruthy()
    })

    it('emits a wishlist clicked event', async () => {
        const element = wrapper.find('header div:last-child div:first-child')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick() // wait until $emits have been handled
        expect(wrapper.emitted().wishlistClicked).toBeTruthy()
    })

    it('emits a basket clicked event', async () => {
        const element = wrapper.find('header div:last-child div:nth-child(2)')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick() // wait until $emits have been handled
        expect(wrapper.emitted().basketClicked).toBeTruthy()
    })

    it('emits a my account clicked event', async () => {
        const element = wrapper.find('header div:last-child div:nth-child(3)')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick() // wait until $emits have been handled
        expect(wrapper.emitted().myAccountClicked).toBeTruthy()
    })

    it('emits a search updated event when search updated', async () => {
        const element = wrapper.find('button')
        element.trigger('click') //simulate click
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().searchClicked).toBeTruthy()
    })
})
