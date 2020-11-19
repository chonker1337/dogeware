(function(){
    if (document.location.href.includes("social.html") || window.cheat) return

    console.log("Injected")

    // requestAnimationFrame - if there's an error, alert it
    let raf = requestAnimationFrame
    window.requestAnimationFrame = function (cb) {
        let c = cb
        arguments[0] = function () {
            try {
                return c.apply(this, arguments)
            } catch (e) {
                alert("FATAL ERROR:\n"+e)
            }
        }

        return raf.apply(this, arguments)
    }


    window.cheat = {
        // default settings
        settings: {
            aimbot: 1,
            superSilent: true,
            AImbot: true,
            frustumCheck: false,
            staticWeaponZoom: false,
            wallbangs: true,
            alwaysAim: false,
            pitchHack: 0,
            thirdPerson: false,
            autoReload: false,
            speedHack: false,
            rangeCheck: false,
            alwaysTrail: false,
            spinAimFrames: 10,
            animatedBillboards: false,
            esp: 1,
            espFontSize: 10,
            tracers: false,
            showGuiButton: true,
            awtv: false,
            uwtv: false,
            forceUnsilent: false,
            bhop: 0,
            spinBot: false,
            markTarget: true,
            skinHack: false,
            aimOffset: 0,
            aimNoise: 0,
            keybinds: true,
            _piano: false,
            antikick: true,
            fovbox: false,
            drawFovbox: true,
            fovBoxSize: 1,
            guiOnMMB: false,
            chams: false,
            wireframe: false,
            chamsc: 0,
            customCss: "",
            selfChams: false,
            autoNuke: false,
            chamsInterval: 500,
            preventMeleeThrowing: false,
            autoSwap: false,
            forceNametagsOn: false,
            aimbotRange: 0,
        },
        state: {
            bindAimbotOn: true,
            quickscopeCanShoot: true,
            spinFrame: 0,
            pressedKeys: new Set(),
            shouldCrouch: false,
            spinCounter: 0,
            activeTab: 0,
            frame: 0
            // check if exist before accessing:
            // me, game, players, controls, three, config, renderer, canvasScale, ctx
        },
        gui: {},
        math: {
            getDir: function(x1, y1, x2, y2) {
                return Math.atan2(y1 - y2, x1 - x2)
            },
            getDistance: function(x1, y1, x2, y2) {
                return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2)
            },
            getD3D: function(x1, y1, z1, x2, y2, z2) {
                const dx = x1 - x2, dy = y1 - y2, dz = z1 - z2
                return Math.sqrt(dx * dx + dy * dy + dz * dz)
            },
            // getAngleDst: function(a, b) {k
            //     return Math.atan2(Math.sin(b - a), Math.cos(a - b))
            // },
            getXDire: function(x1, y1, z1, x2, y2, z2) {
                const h = Math.abs(y1 - y2), dst = this.getD3D(x1, y1, z1, x2, y2, z2)
                return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1))
            },
            lineInRect: function(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
                const t1 = (x1 - lx1) * dx, t2 = (x2 - lx1) * dx, t3 = (y1 - ly1) * dy
                const t4 = (y2 - ly1) * dy, t5 = (z1 - lz1) * dz, t6 = (z2 - lz1) * dz
                const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6))
                const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6))
                return (tmax < 0 || tmin > tmax) ? false : tmin
            },
            //skid
            // getCanSee: function(game, from, toX, toY, toZ, boxSize) {
            //     if (!game || !from) return 0
            //     boxSize = boxSize || 0
            //     const cameraHeight = 1.5
            //     for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - cameraHeight, i = 0; i < game.map.manager.objects.length; ++i)
            //         if (!(obj = game.map.manager.objects[i]).noShoot && /*obj.active &&*/ !obj.transparent) {
            //             const tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize))
            //             if (tmpDst && 1 > tmpDst) return tmpDst
            //         }
            //     const terrain = game.map.terrain
            //     if (terrain) {
            //         const terrainRaycast = terrain.raycast(from.x, -from.z, yOffset, 1 / dx, -1 / dz, 1 / dy)
            //         if (terrainRaycast) return this.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y)
            //     }
            //     return null
            // }
            //-
        },
    }
    Object.assign(window.cheat.settings, JSON.parse(document.getElementById("cheetsttngs").innerHTML))

    // disable audioparam errors
    Object.keys(AudioParam.prototype).forEach(name => {
        if (Object.getOwnPropertyDescriptor(AudioParam.prototype, name).get)
            return
        const old = AudioParam.prototype[name]
        AudioParam.prototype[name] = function() {
            try {
                return old.apply(this, arguments)
            } catch (e) {
                console.log("AudioParam error:\n"+e)
                return false
            }
        }
    })


    // object.prototype defines
    {
        Object.defineProperty(Object.prototype, "thirdPerson", {
            get() {return cheat.settings.thirdPerson}
        })
        Object.defineProperty(Object.prototype, "renderer", {
            enumerable: false, get() {
                if (this.camera) {
                    cheat.state.renderer = this
                }
                return this._renderer
            }, set(v) {
                this._renderer = v
            }
        })
        Object.defineProperty(Object.prototype, "OBJLoader", {
            enumerable: false, get() {
                return this._OBJLoader
            }, set(v) {
                cheat.state.three = this
                this._OBJLoader = v
            }
        })
        Object.defineProperty(Object.prototype, "useLooseClient", {
            enumerable: false, get() {
                return this._ulc
            }, set(v) {
                cheat.state.config = this
                Object.defineProperty(this, "nameVisRate", {
                    value: 0,
                    writable: false,
                    configurable: true,
                })
                this._ulc = v
            }
        })
        Object.defineProperty(Object.prototype, "trail", {
            enumerable: false,
            get() { return cheat.settings.alwaysTrail || this._trail },
            set(v) { this._trail = v }
        })
        Object.defineProperty(Object.prototype, "showTracers", {
            enumerable: false,
            get() { return cheat.settings.alwaysTrail || this._showTracers },
            set(v) { this._showTracers = v }
        })
        Object.defineProperty(Object.prototype, "shaderId", {enumerable: false, get(){if(this.src && this.src.startsWith("pubs/")) return cheat.settings.animatedBillboards ? 1 : this.rshaderId; else return this.rshaderId}, set(v){this.rshaderId = v}})

        Object.defineProperties(Object.prototype, {
            'idleTimer': {enumerable: false, get() { return cheat.settings.antikick ? 0 : this._idleTimer }, set(v) { this._idleTimer = v }},
            'kickTimer': {enumerable: false, get() { return cheat.settings.antikick ? Infinity : this._kickTimer }, set(v) { this._kickTimer = v }},
        })
    }

    // rendering
    {
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'save', { // WASTE OF TIME SIDNEY
            value: CanvasRenderingContext2D.prototype.save,
            writable: false
        })

        function initCheatCanvas(inGameUI) {
            cheat.canvas = document.createElement("canvas")
            cheat.canvas.width = innerWidth
            cheat.canvas.height = innerHeight
            window.addEventListener("resize", () => {
                const scale = cheat.state.canvasScale || 1
                cheat.canvas.width = innerWidth/scale
                cheat.canvas.height = innerHeight/scale
            })
            inGameUI.insertAdjacentElement("beforeend", cheat.canvas)
            cheat.state.ctx = cheat.canvas.getContext("2d")
        }
        const itv = setInterval(() => {
            if (document.getElementById("inGameUI")) {
                clearInterval(itv)
                initCheatCanvas(document.getElementById("inGameUI"))
            }
        }, 100)
        function renderHook() {
            if (!cheat.state.renderHookArgs) return
            const [_, game, controls, renderer, me, delta] = cheat.state.renderHookArgs
            cheat.state.canvasScale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
            cheat.state.players = game.players
            cheat.state.game = game
            cheat.state.controls = controls
            cheat.state.renderer = renderer
            cheat.state.me = me

            if (!cheat.state.renderer.frustum) return

            if (me && me.weapon && !me.weapon.zoomHooked) {
                me.weapon.zoomHooked = true
                me.weapon._zoom = me.weapon.zoom
                Object.defineProperty(me.weapon, "zoom", {
                    get() {return cheat.settings.staticWeaponZoom ? 1 : this._zoom }
                })
            }

            const ctx = cheat.state.ctx
            const scale = parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
            const width = innerWidth/scale, height = innerHeight/scale
            cheat.canvas.width = width
            cheat.canvas.height = height

            if (!ctx) return

            function world2Screen(pos, yOffset = 0) {
                pos.y += yOffset
                pos.project(cheat.state.renderer.camera)
                pos.x = (pos.x + 1) / 2
                pos.y = (-pos.y + 1) / 2
                pos.x *= width
                pos.y *= height
                return pos
            }
            function line(x1, y1, x2, y2, lW, sS) {
                ctx.save()
                ctx.lineWidth = lW + 2
                ctx.beginPath()
                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)
                ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
                ctx.stroke()
                ctx.lineWidth = lW
                ctx.strokeStyle = sS
                ctx.stroke()
                ctx.restore()
            }
            function rect(x, y, ox, oy, w, h, color, fill) {
                ctx.save()
                ctx.translate(~~x, ~~y)
                ctx.beginPath()
                fill ? ctx.fillStyle = color : ctx.strokeStyle = color
                ctx.rect(ox, oy, w, h)
                fill ? ctx.fill() : ctx.stroke()
                ctx.closePath()
                ctx.restore()
            }
            function getTextMeasurements(arr) {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = ~~ctx.measureText(arr[i]).width
                }
                return arr
            }
            function gradient(x, y, w, h, colors) {
                const grad = ctx.createLinearGradient(x, y, w, h)
                for (let i = 0; i < colors.length; i++) {
                    grad.addColorStop(i, colors[i])
                }
                return grad
            }
            function text(txt, font, color, x, y) {
                ctx.save()
                ctx.translate(~~x, ~~y)
                ctx.fillStyle = color
                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
                ctx.font = font
                ctx.lineWidth = 1
                ctx.strokeText(txt, 0, 0)
                ctx.fillText(txt, 0, 0)
                ctx.restore()
            }

            const padding = 2

            ctx.clearRect(0, 0, width, height)
            // tecchhchy (with some stuff by me)
            if (cheat.settings.esp > 1) {
                for(const player of cheat.state.players.list.filter(v => (!v.isYTMP && v.active && (v.pos = {x: v.x, y: v.y, z: v.z})))) {
                    let pos = new cheat.state.three.Vector3(player.pos.x, player.pos.y, player.pos.z)
                    let screenR = world2Screen(pos.clone())
                    let screenH = world2Screen(pos.clone(), player.height)
                    let hDiff = ~~(screenR.y - screenH.y)
                    let bWidth = ~~(hDiff * 0.6)
                    let font = cheat.settings.espFontSize+"px GameFont"

                    if (!cheat.state.renderer.frustum.containsPoint(player.pos)) continue

                    if (cheat.settings.tracers) {
                        line(width / 2, (cheat.settings.tracers === 2 ? height / 2 : height - 1), screenR.x, screenR.y, 2, player.team === null ? "#FF4444" : player.team === cheat.state.me.team ? "#44AAFF" : "#FF4444")
                    }


                    if (player.isTarget) {
                        ctx.save()
                        let meas = getTextMeasurements(["TARGET"])
                        text("TARGET", font, "#FFFFFF", screenH.x-meas[0]/2, screenH.y-cheat.settings.espFontSize*1.5)

                        ctx.beginPath()

                        ctx.translate(screenH.x, screenH.y+Math.abs(hDiff/2))
                        ctx.arc(0, 0, Math.abs(hDiff/2)+10, 0, Math.PI*2)

                        ctx.strokeStyle = "#FFFFFF"
                        ctx.stroke()
                        ctx.closePath()
                        ctx.restore()
                    }

                    if (cheat.settings.esp === 2) {
                        ctx.save()
                        ctx.strokeStyle = (me.team === null || player.team !== me.team) ? "#FF4444" : "#44AAFF"
                        ctx.strokeRect(screenH.x-bWidth/2, screenH.y, bWidth, hDiff)
                        ctx.restore()
                        continue
                    }

                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#000000", false)
                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#44FF44", true)
                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((player[cheat.vars.maxHealth] - player.health) / player[cheat.vars.maxHealth] * (hDiff + 2)), "#000000", true)
                    ctx.save()
                    ctx.lineWidth = 4
                    ctx.translate(~~(screenH.x - bWidth / 2), ~~screenH.y)
                    ctx.beginPath()
                    ctx.rect(0, 0, bWidth, hDiff)
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
                    ctx.stroke()
                    ctx.lineWidth = 2
                    ctx.strokeStyle = player.team === null ? '#FF4444' : cheat.state.me.team === player.team ? '#44AAFF' : '#FF4444'
                    ctx.stroke()
                    ctx.closePath()
                    ctx.restore()


                    let playerDist = ~~(cheat.math.getD3D(me.x, me.y, me.z, player.pos.x, player.pos.y, player.pos.z) / 10)
                    ctx.save()
                    ctx.font = font
                    let meas = getTextMeasurements(["[", playerDist, "m]", player.level, "©", player.name])
                    ctx.restore()
                    let grad2 = gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"])
                    if (player.level) {
                        let grad = gradient(0, 0, (meas[4] * 2) + meas[3] + (padding * 3), 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"])
                        rect(~~(screenH.x - bWidth / 2) - 12 - (meas[4] * 2) - meas[3] - (padding * 3), ~~screenH.y - padding, 0, 0, (meas[4] * 2) + meas[3] + (padding * 3), meas[4] + (padding * 2), grad, true)
                        text(""+player.level, font, '#FFFFFF', ~~(screenH.x - bWidth / 2) - 16 - meas[3], ~~screenH.y + meas[4] * 1)
                    }
                    rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true)
                    text(player.name, font, player.team === null ? '#FFCDB4' : me.team === player.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                    if (player.clan) text("["+player.clan+"]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
                    text(player.health+" HP", font, "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
                    text(player.weapon.name, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                    text("[", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                    text(""+playerDist, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                    text("m]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
                }
            }
            if (cheat.settings.chams && cheat.state.players) {
                for (let player of cheat.state.players.list.filter(v => ((cheat.settings.selfChams || !v.isYTMP) && v.active && (v.pos = {x: v.x, y: v.y, z: v.z})))) {
                    let o = player[cheat.vars.objInstances]
                    if (!o) {
                        continue
                    }
                    // Reflect.defineProperty doesnt throw errors
                    Reflect.defineProperty(o, "visible", {
                        get() {
                            return cheat.settings.chams || this._visible
                        },
                        set(v){
                            this._visible = v
                        }
                    })

                    o.traverse(e => {
                        if (e.type === "Mesh") {
                            Reflect.defineProperty(e.material, "wireframe", {
                                get() {
                                    return cheat.settings.wireframe || this._wf
                                },
                                set(v){
                                    this._wf = v
                                }
                            })
                            e.visible = true
                            e.material.visible = true
                            e.material.depthTest = false
                            e.material.transparent = true
                            e.material.fog = false

                            const modes = [
                                null,
                                {r: 1},
                                {g: 1},
                                {b: 1},
                                {g: 1, b: 1},
                                {r: 1, b: 1},
                                {r: 1, g: 1}
                            ]
                            if (cheat.settings.chamsc === 7) {
                                // epilepsy
                                e.material.emissive = modes[1+Math.floor(Math.random()*6)]
                            } else if (cheat.settings.chamsc === 8) {
                                // rgb
                                let cur = ~~((Date.now()%(cheat.settings.chamsInterval*6))/cheat.settings.chamsInterval)
                                e.material.emissive = modes[cur+1]
                            } else {
                                e.material.emissive = modes[cheat.settings.chamsc]
                            }
                        }
                    })
                }
            }

            if (cheat.settings.fovbox && cheat.settings.drawFovbox) {
                let fovBox = [width/3, height/4, width*(1/3), height/2]
                switch (cheat.settings.fovBoxSize) {
                    // medium
                    case 2:
                        fovBox = [width*0.4, height/3, width*0.2, height/3]
                        break
                    // small
                    case 3:
                        fovBox = [width*0.45, height*0.4, width*0.1, height*0.2]
                        break
                }
                ctx.save()
                ctx.strokeStyle = "red"
                ctx.strokeRect(...fovBox)
                ctx.restore()
            }
        }

        const isDefined = (x) => typeof x !== "undefined" && x !== null
        Object.defineProperty(Object.prototype, "render", {
            enumerable: false, get() {
                return this._render
            }, set(v) {
                if (isDefined(this.showHits)) {
                    this._render = new Proxy(v, {
                        apply(target, thisArg, argArray) {
                            let ret = target.apply(thisArg, argArray)
                            cheat.state.renderHookArgs = argArray
                            renderHook()
                            return ret
                        }
                    })
                } else {
                    this._render = v
                }
            }
        })

    }

    // skin hack
    {
        let skinConfig = {}

        function s(c) {
            window.dispatchWsEvent = c._dispatchEvent.bind(c)
            window.sendWsMessage = c.send.bind(c)

            c.send = new Proxy(c.send, {
                apply(target, thisArg, msg) {
                    if (msg[0] === "ent")
                        skinConfig = {
                            main: msg[1][2][0],
                            secondary: msg[1][2][1],
                            hat: msg[1][3],
                            body: msg[1][4],
                            knife: msg[1][9],
                            dye: msg[1][14],
                            waist: msg[1][17],
                        }

                    return target.apply(thisArg, msg)
                }
            })
            c._dispatchEvent = new Proxy(c._dispatchEvent, {
                apply(target, thisArg, [type, msg]) {
                    if (skinConfig && type === "0" && cheat.settings.skinHack) {
                        const playersInfo = msg[0]
                        let perPlayerSize = 38
                        while (playersInfo.length % perPlayerSize !== 0)
                            perPlayerSize++

                        for(let i = 0; i < playersInfo.length; i += perPlayerSize)
                            if (playersInfo[i] === c.socketId) {
                                playersInfo[i + 12] = [skinConfig.main, skinConfig.secondary]
                                playersInfo[i + 13] = skinConfig.hat
                                playersInfo[i + 14] = skinConfig.body
                                playersInfo[i + 19] = skinConfig.knife
                                playersInfo[i + 25] = skinConfig.dye
                                playersInfo[i + 33] = skinConfig.waist
                            }
                    }
                    return target.apply(thisArg, arguments[2])
                }
            })
        }

        const events = Symbol("kpal")
        Object.defineProperty(Object.prototype, "events", {enumerable:!1,get(){return this[events]},set(v){if(this.ahNum===0){s(this)}this[events]=v}})
        const skins = Symbol("lol anticheat")
        Object.defineProperty(Object.prototype, "skins", {
            enumerable: false,
            get() {
                if (this.stats && cheat.settings.skinHack) {
                    return this.fakeSkins
                }
                return this[skins]
            },
            set(v) {
                if ("stats" in this) {
                    this.fakeSkins = []
                    for (let i = 0; i < 5000; i++) {
                        if (v[i]) {
                            this.fakeSkins.push({ind: i, cnt: v[i].cnt})
                        } else {
                            this.fakeSkins.push({ind: i, cnt: "SH"})
                        }
                    }
                }
                this[skins] = v
            }
        })
    }

    // gui
    let initGUI
    {
        function getGuiHtml() {
            const builder = {
                checkbox: (name, settingName, description = "", needsRestart = false) =>
                    `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='cheat.gui.setSetting("${settingName}", this.checked)' ${cheat.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`,
                select: (name, settingName, options, description = "", needsRestart = false) => {
                    let built = `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<select onchange='cheat.gui.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`
                    for (const option in options) {
                        if (options.hasOwnProperty(option))
                            built += `<option value="${options[option]}" ${cheat.settings[settingName] == options[option]?"selected":""}>${option}</option>,`
                    }
                    return built + "</select></div>"
                },
                slider: (name, settingName, min, max, step, description = "") =>
                    `<div class="settName" title="${description}">${name} <input type="number" class="sliderVal" id="slid_input_${settingName}" min="${min}" max="${max}" value="${cheat.settings[settingName]}" onkeypress="cheat.gui.setSetting('${settingName}', parseFloat(this.value.replace(',', '.')));document.querySelector('#slid_input_${settingName}').value=this.value" style="margin-right:0;border-width:0"><div class="slidecontainer" style=""><input type="range" id="slid_${settingName}" min="${min}" max="${max}" step="${step}" value="${cheat.settings[settingName]}" class="sliderM" oninput="cheat.gui.setSetting('${settingName}', parseFloat(this.value));document.querySelector('#slid_input_${settingName}').value=this.value"></div></div>`,
                input: (name, settingName, type, description, extra) =>
                    `<div class="settName" title="${description}">${name} <input type="${type}" name="${type}" id="slid_utilities_${settingName}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${cheat.settings[settingName]}" oninput="cheat.gui.setSetting(\x27${settingName}\x27, this.value)"/></div>`,
                label: (name, description) =>
                    "<br><span style='color: black; font-size: 20px; margin: 20px 0'>"+name+"</span> <span style='color: dimgrey; font-size: 15px'>"+(description||"")+"</span><br>",

                style: content => `<style>${content}</style>`,
            }
            let built = `<div id="settHolder">
                <h3 style="margin-bottom: 10px">Dogeware v3</h3>
                <h5 style="margin: 15px 0">Made by chonker1337, Join <a href="https://gg.cheems.art/">Gaming Gurus</a> for more hacks.<br></h5>`

            // fix ugly looking 'built +=' before every builder call
            Object.keys(builder).forEach(name => {
                const o = builder[name]
                builder[name] = function () {
                    return built += o.apply(this, arguments), ""
                }
            })

            // Tabs stuff
            const tabNames = ["Weapon", "Wallhack", "Visual", "Tweaks", "Movement", "Other"]
            builder.style(`
                .cheatTabButton {
                    color: black;
                    background: #ddd;
                    padding: 2px 7px;
                    font-size: 15px;
                    cursor: pointer;
                    text-align: center;
                }
                .cheatTabActive {
                    background: #bbb;
                }
            `)
            cheat.gui.changeTab = function (tabbtn) {
                let tn = tabbtn.innerText
                document.getElementById("cheat-tabbtn-"+tabNames[cheat.state.activeTab]).classList.remove("cheatTabActive")
                document.getElementById("cheat-tab-"+tabNames[cheat.state.activeTab]).style.display = "none"
                tabbtn.classList.add("cheatTabActive")
                document.getElementById("cheat-tab-"+tn).style.display = "block"
                cheat.state.activeTab = tabNames.indexOf(tn)
            }
            built += `<table style="width: 100%; margin-bottom: 30px"><tr>`
            for (let i = 0; i < tabNames.length; i++) {
                const tab = tabNames[i]
                built += `<td id="cheat-tabbtn-${tab}" onclick="cheat.gui.changeTab(this)" class="cheatTabButton ${tabNames[cheat.state.activeTab] === tab ? 'cheatTabActive' : ''}">`
                built += tab
                built += `</td>`
            }
            built += `</table></tr>`
            function tab(i, cb) {
                built += `<div style="display: ${cheat.state.activeTab === i ? 'block' : 'none'}" class="cheat-tab" id="cheat-tab-${tabNames[i]}">`
                cb()
                built += `</div>`
            }

            // build gui
            tab(0, () => {
                builder.select("Aimbot [Y]", "aimbot", {
                    "None": 0,
                    "Quickscope / Auto pick": 1,
                    "Silent aimbot": 2,
                    //"Spin aimbot": 3,
                    "Aim assist": 4,
                    "Easy aim assist": 11,
                    "SP Trigger bot": 12,
                    "Silent on aim": 6,
                    "Smooth": 7,
                    "Unsilent": 10,
                    "Unsilent on aim": 5,
                    "Aim correction": 9,
                })
                builder.select("Spin aimbot speed", "spinAimFrames", {
                    "1": 30,
                    "2": 20,
                    "3": 15,
                    "4": 10,
                    "5": 5,
                })
                builder.slider("Aim range", "aimbotRange", 0, 1000, 10, "Set above 0 to make the aimbot pick enemies only at the selected range")
                builder.slider("Aim offset", "aimOffset", -4, 1, 0.1, "The lower it is, the lower the aimbot will shoot (0 - head, -4 - body)")
                builder.slider("Aim noise", "aimNoise", 0, 2, 0.005, "The higher it is, the lower is the aimbot accuracy")
                builder.checkbox("Supersilent aim", "superSilent", "Only works with quickscope and silent aim, makes it almost invisible that you're looking at somebody when you're shooting at him")
                builder.checkbox("Aim at AIs", "AImbot", "Makes the aimbot shoot at NPCs")
                builder.checkbox("FOV check", "frustumCheck", "Makes you only shoot at enemies that are in your field of view. Prevents 180 flicks")
                builder.checkbox("FOV box", "fovbox", "Creates a box in which enemies can be targetted, enable with FOV check")
                builder.select("FOV box size", "fovBoxSize", {
                    "Big": 1,
                    "Medium": 2,
                    "Small": 3,
                })
                builder.checkbox("Wallbangs", "wallbangs", "Makes the aimbot shoot enemies behind walls")
                builder.checkbox("Aimbot range check", "rangeCheck", "Checks if the enemy is in range of your weapon before shooting it, disable for rocket launcher")
                builder.checkbox("Auto reload", "autoReload", "Automatically reloads your weapon when it's out of ammo")
                builder.checkbox("Prevent melee throwing", "pmt", "Prevents you from throwing your knife")
                builder.checkbox("Auto swap", "aswp", "Automatically swaps the weapon when you're out of ammo")
            })

            tab(1, () => {
                builder.select("ESP [H]", "esp", {
                    "None": 0,
                    "Nametags": 1,
                    "Box ESP": 2,
                    "Full ESP": 3,
                })
                builder.select("ESP Font Size", "espFontSize", {
                    "30px": 30,
                    "25px": 25,
                    "20px": 20,
                    "15px": 15,
                    "10px": 10,
                    "5px": 5,
                })
                builder.select("Tracers", "tracers", {
                    "None": 0,
                    "Bottom": 1,
                    "Middle": 2,
                }, "Draws lines to players")
                builder.checkbox("Mark aimbot target", "markTarget", "Shows who is the aimbot targetting at the time, useful for aim assist/aim correction")
                builder.checkbox("Draw FOV box", "drawFovbox", "Draws the FOV box from aimbot settings")
                builder.checkbox("Chams", "chams")
                builder.select("Chams colour", "chamsc", {
                    "None": 0,
                    "Red": 1,
                    "Green": 2,
                    "Blue": 3,
                    "Cyan": 4,
                    "Pink": 5,
                    "Yellow": 6,
                    "RGB": 8,
                    "Epilepsy": 7,
                })
                builder.checkbox("Self chams", "selfChams", "Makes your weapon affected by chams")
                builder.checkbox("Wireframe", "wireframe")
                builder.slider("RGB interval", "chamsInterval", 50, 1000, 50, "How fast will the RGB chams change colour")
            })

            tab(2, () => {
                builder.checkbox("Skin hack", "skinHack", "Makes you able to use any skin in game, only shows on your side")
                builder.checkbox("Third person mode", "thirdPerson")
                builder.checkbox("No weapon zoom", "staticWeaponZoom", "Removes the distracting weapon zoom animation")
                builder.checkbox("Any weapon trail", "alwaysTrail")
                builder.checkbox("Billboard shaders", "animatedBillboards", "Disable if you get fps drops")
            })

            tab(3, () => {
                builder.checkbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies  faster. Only use if ur good at bhopping")
                builder.checkbox("Aim when target visible", "awtv")
                builder.checkbox("Unaim when no target visible", "uwtv")
                builder.checkbox("Force unsilent", "forceUnsilent")
            })

            tab(4, () => {
                builder.select("Auto bhop", "bhop", {
                    "None": 0,
                    "Auto Jump": 1,
                    "Key Jump": 2,
                    "Auto Slide": 3,
                    "Key Slide": 4,
                })
                builder.label("Only use with silent aim")
                builder.select("Pitch hax", "pitchHack", {
                    "Disabled": 0,
                    "Downward": 1,
                    "Upward": 2,
                    "sin(time)": 3,
                    "sin(time/5)": 4,
                    "double": 5,
                    "random": 6,
                }, "Only use with aimbot on")
                builder.checkbox("Spin bot", "spinBot")
            })

            tab(5, () => {
                builder.input("Custom CSS", "customCss", "url", "", "URL to CSS file")
                builder.checkbox("Show GUI button", "showGuiButton", "Disable if you don't want the dog under settings to be visible")
                builder.checkbox("GUI on middle mouse button", "gommb", "Makes it possible to open this menu by clicking the mouse wheel")
                builder.checkbox("Piano music", "piano", "Piano music")
                builder.checkbox("Keybinds", "keybinds", "Turn keybinds on/off, Aimbot - Y, ESP - H")
                builder.checkbox("No inactivity kick", "antikick", "Disables the 'Kicked for inactivity' message (client side, but works)")
                builder.checkbox("Auto nuke", "autoNuke", "Automatically nukes when you are able to")
                builder.checkbox("Force nametags on", "fgno", "Use in custom games with disabled nametags")
            })

            built += "</div>"

            return built
        }
        initGUI = function() {
            function createButton(name, iconURL, fn) {
                const menu = document.querySelector("#menuItemContainer"),
                    menuItem = document.createElement("div"),
                    menuItemIcon = document.createElement("div"),
                    menuItemTitle = document.createElement("div")

                menuItem.className = "menuItem"
                menuItemIcon.className = "menuItemIcon"
                menuItemTitle.className = "menuItemTitle"

                menuItemTitle.innerHTML = name
                menuItemIcon.style.backgroundImage = `url("https://i.imgur.com/QkEcRaR.png")`

                menuItem.append(menuItemIcon, menuItemTitle)
                menu.append(menuItem)

                menuItem.addEventListener("click", fn)
            }
            cheat.gui.cssElem = document.createElement("link")
            cheat.gui.cssElem.rel = "stylesheet"
            cheat.gui.cssElem.href = cheat.settings.customCss
            try {
                document.head.appendChild(cheat.gui.cssElem)
            } catch (e) {
                alert("Error injecting custom CSS:\n"+e)
                cheat.settings.customCss = ""
            }
            cheat.gui.setSetting = function(setting, value) {
                switch (setting) {
                    case "customCss":
                        cheat.settings.customCss = value
                        break

                    default:
                        cheat.settings[setting] = value
                }

                document.getElementById("cheetsttngs").innerHTML = JSON.stringify(cheat.settings)
            }
            cheat.gui.windowIndex = windows.length+1
            cheat.gui.settings = {
                aimbot: {
                    val: cheat.settings.aimbot
                }
            }
            cheat.gui.windowObj = {
                header: "CH33T",
                html: "",
                gen() {
                    return getGuiHtml()
                }
            }
            Object.defineProperty(window.windows, windows.length, {
                value: cheat.gui.windowObj
            })

            if (cheat.settings.showGuiButton) {
                createButton("CH33TS", null, () => {
                    window.showWindow(cheat.gui.windowIndex)
                })
            }
        }
        function showGUI() {
            if (document.pointerLockElement || document.mozPointerLockElement) {
                document.exitPointerLock()
            }
            window.showWindow(cheat.gui.windowIndex)
        }

        // event listeners
        // show gui
        window.addEventListener("mouseup", (e) => {
            if(e.which === 2 && cheat.settings.guiOnMMB) {
                e.preventDefault()
                showGUI()
            }
        })
        window.addEventListener("keydown", ev => {
            if (ev.key === "F1") {
                ev.preventDefault()
                ev.stopPropagation()
                ev.stopImmediatePropagation()
                showGUI()
            }
        })
        window.addEventListener("keydown", ev => {
            if (!cheat.state.pressedKeys.has(ev.code)) {
                cheat.state.pressedKeys.add(ev.code)
            }
        })
        window.addEventListener("keyup", ev => {
            if (cheat.state.pressedKeys.has(ev.code)) {
                cheat.state.pressedKeys.delete(ev.code)
            }
            if (!(document.activeElement.tagName === "INPUT" || !window.endUI && window.endUI.style.display) && cheat.settings.keybinds) {
                switch (ev.code) {
                    case "KeyY":
                        cheat.state.bindAimbotOn = !cheat.state.bindAimbotOn
                        dispatchWsEvent("ch", [null, ("Aimbot "+(cheat.state.bindAimbotOn?"on":"off")), 1])
                        break
                    case "KeyH":
                        cheat.settings.esp = (cheat.settings.esp+1)%4
                        dispatchWsEvent("ch", [null, "ESP: "+["disabled", "nametags", "box", "full"][cheat.settings.esp], 1])
                        break
                }
            }
        })
    }

    const subtract = new Function(window.chonkercheats)

    function onVars() {
        Object.defineProperty(Object.prototype, cheat.vars.procInputs, {
            enumerable: false,
            get() {
                return this._procInputs
            },
            set(v) {
                if (typeof v === "function") {
                    this._procInputs = new Proxy(v, {
                        apply(target, thisArg, argArray) {
                            subtract.apply(thisArg, argArray)
                            return target.apply(thisArg, argArray)
                        }
                    })
                } else {
                    this._procInputs = v
                }
            }
        })
    }

    function setVars(script) {
        //shawn
        script = script.replace(/\[(0x[a-zA-Z0-9]+,?)+]\['map']\(\w+=>String\['fromCharCode']\(\w+\)\)\['join']\(''\)/g, a => "'" + eval(a) + "'")
        //-

        cheat.vars = {}
        const regexes = new Map()
            .set("inView", [/continue;if\(\S+\['\S+']\|\|!\S+\['(\S+)']\)continue;if\(!\S+\['(\S+)']\)continue/, 2])
            //.set("canSee", [/\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, 1])
            .set("procInputs", [/this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, 1])
            .set("aimVal", [/this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, 1])
            //.set("pchObjc", [/0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, 1])
            .set("didShoot", [/--,\w+\['(\w+)']=!0x0/, 1])
            .set("nAuto", [/'Single\\x20Fire','varN':'(\w+)'/, 1])
            .set("crouchVal", [/this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, 1])
            .set("ammos", [/\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, 1])
            .set("weaponIndex", [/\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, 1])
            .set("objInstances", [/continue;if\(\S+\['\S+']\|\|!\S+\['(\S+)']\)continue;if\(!\S+\['(\S+)']\)continue/, 1])
            //.set("getWorldPosition", [/{\w+=\w+\['camera']\['(\w+)']\(\);/, 1])
            //.set("mouseDownL", [/this\['\w+']=function\(\){this\['(\w+)']=\w*0,this\['(\w+)']=\w*0,this\['\w+']={}/, 1])
            //.set("mouseDownR", [/this\['(\w+)']=0x0,this\['keys']=/, 1])
            .set("reloadTimer", [/this\['(\w+)']-=\w+,\w+\['reloadUIAnim']/, 1])
            .set("maxHealth", [/this\['health']\/this\['(\w+)']\?/, 1])
            //.set("xVel", [/this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, 1])
            //.set("yVel", [/this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, 1])
            //.set("zVel", [/this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, 1])
            .set("recoilAnimY", [/,this\['(\w+)']\+=this\['recoilForce']/, 1])


        for (const [name, arr] of regexes) {
            let found = arr[0].exec(script)
            if (!found) {
                alert("Failed to find " + name)
                cheat.vars[name] = name
            } else {
                cheat.vars[name] = found[arr[1]]
            }
        }
        console.log("VARS:")
        console.table(cheat.vars)
        console.log(JSON.stringify(cheat.vars))

        onVars()
    }
    function patch(gameCode) {
        //shawn
        gameCode = gameCode.replace(/\[(0x[a-zA-Z0-9]+,?)+]\['map']\(\w+=>String\['fromCharCode']\(\w+\)\)\['join']\(''\)/g, a => "'" + eval(a) + "'")
        //-

        // nametags
        gameCode = gameCode.replace(/if\((!\w+\['[^']+'])\)continue;/, "if(($1&&!([1,2].includes(cheat.settings.esp)))||cheat.settings.esp===3)continue;")

        // wallbangs
        gameCode = gameCode.replace(/!(\w+)\['transparent']/, "(cheat.settings.wallbangs ? !$1.penetrable : !$1.transparent)")

        // aimbot (procinputs)
        // moved to a object.defineproperty
        //gameCode = gameCode.replace(/(this\['\w+']=function\(\w+,\w+,\w+,\w+\){)(this\['recon'])/, "$1{\n"+window.chonkercheats+"};$2")

        return gameCode
    }

    window.gameCodeInit = function(script) {
        console.log("Initializing cheat")
        return setVars(script), patch(script)
    }
    function when(fn, cb) {
        if (fn()) {
            return cb()
        }
        const itv = setInterval(() => {
            if (fn()) {
                clearInterval(itv)
                cb()
            }
        }, 100)
    }

    when(() => window.windows, initGUI)

    // Piano
    window.addEventListener("load", () => {
        document.body.appendChild(Object.assign(document.createElement("div"), {
            id: "pianoHolder",
            innerHTML: `
                <style> #pianoHolder { display: none } </style>
                <audio id="pianoMusic" controls loop>
                <source src="${window.pianoUrl}" type="audio/mpeg">
                </audio>
            `
        }))

        if (cheat.settings.piano) {
            document.querySelector("#pianoMusic").play()
        }

        Object.defineProperty(cheat.settings, "piano", {
            set(v) {
                if (v) {
                    document.querySelector("#pianoMusic").play()
                } else {
                    document.querySelector("#pianoMusic").pause()
                }
                cheat.settings._piano = v
            },
            get() {
                return cheat.settings._piano
            }
        })
    })
})()