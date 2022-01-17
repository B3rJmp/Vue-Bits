<template>
  <div class="main">
      <div class="container">
          <div class="toolbar">
              <div class="tools left">
                  <button title="Previous" style="margin-right: 10px;" @click.prevent="changePage('up')">
                      <span class="fas fa-arrow-up"></span>
                  </button>
                  <button title="Next" style="margin-right: 10px;" @click.prevent="changePage('down')">
                        <span class="fas fa-arrow-down" title="Next"></span>
                  </button>
                  <button v-if="!preview" title="Select" @click.prevent="include()">
                      <span class="fas fa-hand-pointer" title="Select"></span>
                      Select
                  </button>
              </div>
              <div class="tools center">
                  <p v-if="this.pdfDoc">Page <input type="text" v-model="pageNum" @change="goTo(pageNum)"> of
                      {{this.pdfDoc.numPages}}</p>
              </div>
              <div class="tools right">
                  <button v-if="!preview" title="Save" style="margin-right: 10px;" @click.prevent="save()">
                      <span class="fas fa-save"></span>
                  </button>
                  <button title="Close" @click="save(true)">
                      <span class="fas fa-times"></span>
                  </button>
              </div>
          </div>
          <div class="editor" @keydown.prevent="handleKey" tabindex="-1">
              <div id="sidebar" v-if="pdfDoc && showSidebar" @scroll="lazyLoad">
                  <div v-for="index in pdfDoc.numPages" :key="index"
                      :class="['thumb', (index) === pageNum ? 'selected' : '']" @click="goTo(index)"
                      :data-include="((file.pages && file.pages[index-1] === '1') || preview) ? true : false">
                      <img src="" alt="">
                      <span :style="preview ? 'display: none;' : ''" class="include fas fa-check-circle"></span>
                  </div>
              </div>
              <div class="window">
                  <div class="progress" v-if="progress.show" :style="'width: ' + progress.perc + '%;'"></div>
                  <canvas id="page"></canvas>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapActions, mapMutations} from 'vuex'
export default {
    props: {
        file: Object,
        preview: Boolean
    },
    data() {
        return {
            showEditor: false,
            showSidebar: true,
            url: null,
            filesRoot: 'files/',
            pages: null,
            pdfDoc: null,
            pageNum: 1,
            currentDoc: null,
            pageIsRendering: false,
            pageNumIsPending: null,
            scale: 1,
            thumbnails: [],
            mainScale: null,
            cancelRender: true,
            progress: {
                perc: 0,
                show: true
            },
            lrgDoc: false,
            thumbScale: null,
        }
    },
    computed: {
        canvas() {
            return document.querySelector('#page')
        },
        ctx() {
            return document.querySelector('#page').getContext('2d')
        },
        percInc() {
            if (this.pdfDoc) {
                return (100 / this.pdfDoc.numPages)
            }
        },
    },
    methods: {
        ...mapActions([
            'updatePages'
        ]),
        ...mapMutations([
            'setLoading',
            'setProcessing'
        ]),
        cancel() {
            this.cancelRender = true
        },
        echo(data) {
            console.log(data)
        },
        goTo(num) {
            var page = Number(num)
            if (isNaN(page) || page <= 0 || page > this.pdfDoc.numPages) {
                page = 1
                this.pageNum = 1
            } else {
                this.pageNum = page
            }
            this.renderPage(page).then(() => {
                this.scroll()
            })
        },
        scroll() {
            var parent = document.getElementById('sidebar')
            var active = document.querySelector('.thumb.selected')
            var parentBox = parent.getBoundingClientRect()
            var activeBox = active.getBoundingClientRect()
            if ((parentBox.bottom - activeBox.bottom) <= 20 || (activeBox.top - parentBox.top) < 30) {
                parent.scrollTop = ((active.offsetTop - active.offsetHeight) - 50)
            }
        },
        handleKey(e) {
            if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
                this.changePage('up')
            }
            if (e.key == "ArrowDown" || e.key == "ArrowRight") {
                this.changePage('down')
            }
            if (e.code == "Space" && !this.preview) {
                this.include()
            }
            if (e.key == 'Enter' && e.shiftKey) {
                this.save()
            }

        },
        include() {
            let selected = document.querySelector('.thumb.selected')
            if (selected.dataset.include && selected.dataset.include == 'true') {
                selected.setAttribute('data-include', false)
            } else {
                selected.setAttribute('data-include', true)
            }
        },
        changePage(dir) {
            if (dir == 'up' && this.pageNum > 1) {
                this.pageNum--
                this.renderPage(this.pageNum).then(() => {
                    this.scroll()
                })
            } else if (dir == 'down' && this.pageNum < this.pdfDoc.numPages) {
                this.pageNum++
                this.renderPage(this.pageNum).then(() => {
                    this.scroll()
                })
            } else {
                return
            }
        },
        save(close = false) {
            if(!this.preview) {
                this.$emit('save')
                var doc = this.file
                var oldPages = this.file.pages
                doc.pages = ''
                let pages = document.querySelectorAll('.thumb')
                if (pages < this.pdfDoc.numPages) {
                    return
                }
                for (let i = 0; i < pages.length; i++) {
                    if (pages[i].dataset.include === 'true') {
                        doc.pages += '1'
                    } else {
                        doc.pages += '0'
                    }
                }
                if (close) {
                    if(doc.pages !== oldPages) {
                        let x = window.confirm('Save?')
                        if (x) {
                            this.updatePages(doc)
                        } else {
                            this.file.pages = oldPages
                        }
                    } else {

                        }
                    return this.close()
                }
                console.log(this.file.pages)
                this.updatePages(doc).then(() => {
                    this.setProcessing({processing: true, finished: true, message: 'Saved!'})
                }).catch(err => {
                    this.setProcessing({processing: true, finished: true, error: err})
                })
                return true
            }else if(this.preview && close) {
                this.close()
            }
        },
        close() {
            this.$emit('close')
        },
        makeThumb(page) {
            var vp = page.getViewport({
                scale: 1
            });
            var canvas = document.createElement("canvas");
            var ratio = vp.width / vp.height
            canvas.width = 98
            canvas.height = canvas.width / ratio
            if (!this.thumbScale) {
                this.thumbScale = canvas.width / vp.width
            }
            return page.render({
                canvasContext: canvas.getContext("2d"),
                viewport: page.getViewport({
                    scale: this.thumbScale
                })
            }).promise.then(function () {
                let url = canvas.toDataURL()
                canvas.remove()
                return url
            });
        },
        getAllPages() {
            var pages = []
            const sidebar = document.querySelector('#sidebar')
            while (pages.length < this.pdfDoc.numPages) {
                pages.push(pages.length + 1)
            }
            this.progress.show = true

            return Promise.all(
                pages.map(num => {
                    return this.pdfDoc.getPage(num).then(page => {
                        if (this.cancelRender) {
                            return
                        }
                        return this.makeThumb(page)
                    }).then(url => {
                        if (this.cancelRender) {
                            return
                        }
                        var thumb = document.querySelectorAll('.thumb img')[num - 1]
                        thumb.setAttribute('data-src', url)
                        if (this.inViewport(thumb)) {
                            thumb.src = url
                        }
                        this.progress.perc += this.percInc
                        if (this.progress.perc >= 100) {
                            this.progress.perc = 100
                        }

                    }).catch(err => {
                        return err
                    })
                })).then(() => {
                return this.progress.show = false
            }).catch(err => {
                console.log(err)
                return
            })
        },
        getPageRange(start, end) {
            var pages = []
            const sidebar = document.querySelector('#sidebar')
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
            this.progress.show = true
            var percInc = (100 / (end - start))

            return Promise.all(
                pages.map(num => {
                    return this.pdfDoc.getPage(num).then(page => {
                        if (this.cancelRender) {
                            return
                        }
                        if (document.querySelectorAll('.thumb')[num].hasAttribute('data-rendered') && document.querySelectorAll('.thumb')[num].dataset.rendered === 'true') {
                            return
                        }

                        return this.makeThumb(page)
                    }).then(url => {
                        if (this.cancelRender) {
                            return
                        }
                        var thumb = document.querySelectorAll('.thumb img')[num - 1]
                        thumb.setAttribute('data-src', url)
                        thumb.setAttribute('data-rendered', true)
                        if (this.inViewport(thumb)) {
                            thumb.src = url
                        }
                        this.progress.perc += percInc
                        if (this.progress.perc >= 100) {
                            this.progress.perc = 100
                        }

                    }).catch(err => {
                        return err
                    })
                })).then(() => {
                return this.progress.show = false
            }).catch(err => {
                console.log(err)
                return
            })
        },
        inViewport(el, range = 400) {
            var parent = document.getElementById('sidebar')
            var parentBox = parent.getBoundingClientRect()
            var elBox = el.getBoundingClientRect()

            if ((parentBox.bottom - elBox.bottom) < -range || (elBox.top - parentBox.top) < -range) {
                return false
            } else {
                return true
            }
        },
        lazyLoad() {
            var visible = []
            document.querySelectorAll('.thumb').forEach((thumb, index) => {
                var img = thumb.querySelector('img')
                var src = img.dataset.src
                if (this.inViewport(thumb)) {
                    img.src = src
                    visible.push(index + 1)
                } else {
                    img.src = ''
                }
            })
            if (this.lrgDoc) {
                let notRendered = null
                for (let num in visible) {
                    let thumb = document.querySelectorAll('.thumb img')[visible[num]]
                    if (!thumb.hasAttribute('data-rendered') || thumb.dataset.rendered == 'false') {
                        notRendered = visible[num]
                        break
                    }
                }
                if (notRendered) {
                    var start = notRendered - 50 <= 0 ? 0 : notRendered - 50
                    var end = start + 100 <= this.pdfDoc.numPages ? start + 100 : this.pdfDoc.numPages
                    this.getPageRange(start, end)
                }
            }
        },
        renderPage(num) {
            this.pageIsRendering = true;

            // Get page
            return this.pdfDoc.getPage(num).then(page => {
                // Set scale
                if (!this.mainScale) {
                    const viewport = page.getViewport({
                        scale: 1
                    });
                    this.canvas.width = 816;
                    var ratio = viewport.width / viewport.height
                    this.canvas.height = this.canvas.width / ratio;
                    this.mainScale = this.canvas.width / viewport.width
                }
                const renderCtx = {
                    canvasContext: this.ctx,
                    viewport: page.getViewport({
                        scale: this.mainScale
                    })
                };

                return page.render(renderCtx).promise.then(() => {
                    this.pageIsRendering = false;

                    if (this.pageNumIsPending !== null) {
                        renderPage(this.pageNumIsPending);
                        this.pageNumIsPending = null;
                    }
                });
            });
        },
        renderDoc() {
            this.progress.show = true
            this.cancelRender = false
            this.lrgDoc = false
            this.setLoading(true)

            // Get Document
            if(!this.preview){
                return pdfjsLib
                    .getDocument('https://www.zaf.local/api/get-file/' + this.file.file.file_name)
                    .promise.then(pdfDoc_ => {
                        this.setLoading(false)
                        this.pdfDoc = pdfDoc_;

                        this.renderPage(this.pageNum);
                        if (this.pdfDoc.numPages > 300) {
                            this.lrgDoc = true
                            this.getPageRange(1, 100)
                        } else {
                            this.getAllPages();
                        }

                    })
                    .catch(err => {
                        this.setLoading(false)
                        console.log('error')
                        console.log(err)
                    });
            }else{
                return pdfjsLib
                    .getDocument('https://www.zaf.local/api/get-file/' + this.file.file_name)
                    .promise.then(pdfDoc_ => {
                        this.setLoading(false)
                        this.pdfDoc = pdfDoc_;

                        this.renderPage(this.pageNum);
                        if (this.pdfDoc.numPages > 300) {
                            this.lrgDoc = true
                            this.getPageRange(1, 100)
                        } else {
                            this.getAllPages();
                        }

                    })
                    .catch(err => {
                        console.log('error')
                        console.log(err)
                    });
            }
        },
    },
    mounted() {
        this.renderDoc()
    },
    beforeUnmount() {
        let thumbnails = document.querySelectorAll('.thumb')
        thumbnails.forEach(canvas => {
            canvas.remove()
        })
    }
}
</script>

<style lang="scss" scoped>
.main {
    text-align: center;
    width: 100%;
}

#save-notification {
    color: green;
    margin-right: 5px;
    &.error {
        color: red;
    }
}

.container {
  border: 2px solid #9a9a9a;
  width: 100%;
  box-sizing: border-box;
}
.editor {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100vh;
  position: relative;
}

#page {
  display: block;
  box-shadow: 0 0 10px 2px rgba(0,0,0,.2);
}

.window {
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 1000px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ededf0;
  overflow: scroll;
  padding: 20px;
  position: relative;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background-color: #0075ff;
}

#sidebar {
  max-width:17%;
  width: 100%;
  height: 100%;
  max-height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #d5d5d8;
  border: 1px solid #a0a0a2;
  overflow: scroll;
  padding: 20px 0;
  border-bottom: none;
}

.thumb {
  margin: 10px 0;
  box-shadow: 0 0 5px 5px rgba(0,0,0,.2);
  opacity: .5;
  height: auto;
  min-height: 126px;
  min-width: 96px;
  position: relative;
  cursor: pointer;
}

.thumb[data-include = "true"] {
  opacity: 1;
}

.thumb span {
  position: absolute;
  top: 0;
  left: 0;
  color: #0075ff;
  background-color: white;
  border-radius: 50%;
  display: none;
}

.thumb[data-include = "true"] span {
  display: block;
}

.thumb img {
  margin-bottom: -5px;
}

.thumb.selected {
  box-shadow: 0 0 0 5px #666;
}

.toolbar {
  background-color: #f9f9fa;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
}

.tools {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 20px;
}

.tools.center input {
  width: 40px;
}

.toolbar p {
  margin: 0;
}
</style>
