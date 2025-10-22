describe('L.Permissions', function () {
  var path = '/map/99/datalayer/edit/62/'

  before(function () {
    this.server = sinon.fakeServer.create()
    this.server.respondWith(
      /\/datalayer\/62\/\?.*/,
      JSON.stringify(RESPONSES.datalayer62_GET)
    )
    this.map = initMap({ umap_id: 99 })
    this.datalayer = this.map.getDataLayerByUmapId(62)
    this.server.respond()
    enableEdit()
  })
  after(function () {
    clickCancel()
    this.server.restore()
    resetMap()
  })

  describe('#open()', function () {
    var button

    it('should exist update permissions link', function () {
      button = qs('a.update-map-permissions')
      expect(button).to.be.ok
    })

    it('should open table button click', function () {
      happen.click(button)
      expect(qs('.permissions-panel')).to.be.ok
    })
  })
  describe('#anonymous with cookie', function () {
    var button

    it('should not allow share_status nor owner', function () {
      this.map.permissions.options.anonymous_edit_url = 'http://anonymous.url'
      delete this.map.options.permissions.owner
      button = qs('a.update-map-permissions')
      happen.click(button)
      expect(qs('select[name="share_status"]')).not.to.be.ok
      expect(qs('input.edit-owner')).not.to.be.ok
    })
  })

  describe('#editor', function () {
    var button

    it('should only allow editors', function () {
      this.map.options.permissions.owner = { id: 1, url: '/url', name: 'jojo' }
      delete this.map.options.permissions.anonymous_edit_url
      delete this.map.options.user
      button = qs('a.update-map-permissions')
      happen.click(button)
      expect(qs('select[name="share_status"]')).not.to.be.ok
      expect(qs('input.edit-owner')).not.to.be.ok
      expect(qs('input.edit-editors')).to.be.ok
    })
  })

  describe('#owner', function () {
    var button

    it('should allow everything', function () {
      this.map.permissions.options.owner = { id: 1, url: '/url', name: 'jojo' }
      this.map.options.user = { id: 1, url: '/url', name: 'jojo' }
      button = qs('a.update-map-permissions')
      happen.click(button)
      expect(qs('input.edit-owner')).to.be.ok
      expect(qs('input.edit-editors')).to.be.ok
    })
  })
})
