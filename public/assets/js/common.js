$(function ($) {

  // 分类菜单
  $('.all-sorts-list').hover(function () {
    $(this).children('.sort').show()
  }, function () {
    $(this).children('.sort').hide()
  })

  $('.all-sort-list2 > .item').hover(function () {
    $(this).addClass('hover')
  }, function () {
    $(this).removeClass('hover')
  })

  // 侧边悬浮按钮
  $('.toolbar-tab').hover(function () {
      $(this).find('.tab-text').html($(this).data('title'))
      $(this).find('.tab-text').addClass('tbar-tab-hover')
      $(this).find('.footer-tab-text').addClass('tbar-tab-footer-hover')
      $(this).addClass('tbar-tab-selected')
    }, function () {
      $(this).find('.tab-text').removeClass('tbar-tab-hover')
      $(this).find('.footer-tab-text').removeClass('tbar-tab-footer-hover')
      $(this).removeClass('tbar-tab-selected')
    })
})
