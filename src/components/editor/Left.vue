<template>
  <div class="sidebar-left">
    <!--tabbar（样式、模板)-->
    <div class="sidebar-left-tool">
      <ul>
        <li :class="{active: isShowTabBar}" tab-idx @click="changeTabbar($event)">样式</li>
        <!--<li :class="{active: !isShowTabBar}" @click="changeTabbar($event)">模板</li>-->
        <li :class="{active: !isShowTabBar}" style="opacity:.3;cursor:initial;">模板</li>
      </ul>
    </div>

    <!-- 所有tabbar内容的展示容器 -->
    <div class="sidebar-left-show">
      <!-- tabbar样式容器内容 -->
      <div class="style" v-show="isShowTabBar">
        <!-- tabbar样式下面所有导航菜单 -->
        <div class="style-nav">
          <ul style="margin-bottom: 0;">
            <li :class="styleNavClass[0]" @click="changeSidebar(0, $event)">
              <img src="./images/biaoti.svg" />
              <span>标题</span>
            </li>
            <li :class="styleNavClass[1]" @click="changeSidebar(1, $event)">
              <img src="./images/zhengwen.svg" />
              <span>正文</span>
            </li>
            <li :class="styleNavClass[2]" @click="changeSidebar(2, $event)">
              <img src="./images/tuwen.svg" />
              <span>图文</span>
            </li>
            <li :class="styleNavClass[3]" @click="changeSidebar(3, $event)">
              <img src="./images/biaoge.svg" />
              <span>表格</span>
            </li>
          </ul>
        </div>

        <div class="style-container" style="overflow-y: auto">
          <!--标题模板列表-->
          <div :class="title" v-show="styleNavClass[0].active">
            <ul>
              <li style="padding: 10px 15px;" v-for="(styleItem, index) in styleDataArrs['title']" v-html="styleItem" @click="selectedStyle('title',index)">
              </li>
            </ul>
          </div>

          <!--正文模板列表-->
          <div class="text" v-show="styleNavClass[1].active" v-scroll="onScroll">
            <ul style="margin-bottom: 0">
              <li style="padding: 10px 15px;" v-for="(styleItem, index) in styleDataArrs['text']" v-html="styleItem" @click="selectedStyle('text',index)">
              </li>
            </ul>
          </div>

          <!--图文模板列表-->
          <div class="image-text" v-show="styleNavClass[2].active">
            <ul>
              <li style="padding: 10px 15px;" v-for="(styleItem, index) in styleDataArrs['image-text']" v-html="styleItem" @click="selectedStyle('image-text',index)"></li>
            </ul>
          </div>

          <!-- 表格模板列表-->
          <div class="table" v-show="styleNavClass[3].active">
            <ul>
              <li style="padding: 10px 15px;" v-for="(styleItem, index) in styleDataArrs['table']" v-html="styleItem" @click="selectedStyle('table',index)"></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- tarbar模板的所有内容 -->
      <div class="template" v-show="!isShowTabBar">
        <ul>
          <li @click="insertTemplate($event)">
            <div template-id="001">
              <section data-id="88108" class="_135editor">
                <section class="_135editor" data-tools="135编辑器" data-id="88107" style="position: relative; border: 0px none; padding: 0px;">
                  <section style="background-color:#FBF6F3;">
                    <section style="color: rgb(255, 255, 255); background-color: #F7AB00;padding:20px 15px 80px" class="135brush" data-style="line-height: 1.75em;text-align: center;font-size: 16px;">
                      <p style="text-align: justify; line-height: 1.75em;">
                        <span style="font-size: 14px;">提到四川，就一定会说到四川美食。在骨灰级吃货眼里的成都美食，不仅仅是一道道诱人的美味，而是一个系统化的美食地图，攻略做的有条理才能说明吃货的功力嘛！</span>
                      </p>
                    </section>
                    <section style="margin-top:-70px;">
                      <p>
                        <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWMxOFF2a2M4Mmt6c3hzN3F4MmljeW13cjQ4SGZ0TTlSRk12alVFOWo0cGoxcWtmM0ZSSXBzWU53LzA/d3hfZm10PXBuZw==" style="margin: 0px;" class="assistant"/>
                      </p>
                    </section>
                    <section style="margin-top:-10px;background-color:#FBF6F3">
                      <section class="135bg" style="padding:80px 0px; background-image: url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWMxV0xlaEpqUVV4RVhEMVJKYUFKWldIVnVXRjd1MWxJSkxhbkFLNm1Oa2J0UXBqSnZVWmlib253LzA/d3hfZm10PWpwZWc=);background-size:contain; background-position: 50% 50%; background-repeat: no-repeat;min-width:100%;">
                        <p style="color: rgb(255, 255, 255);text-align: center;letter-spacing: 2px;">
                          <span style="font-size: 28px; color: #F2AE27;"><strong><span style="color: #F2AE27; font-size: 24px;">舌尖上的四川</span></strong></span>
                        </p>
                        <p style="color: rgb(255, 255, 255); letter-spacing: 2px; text-align: center;">
                          <span style="color: #F2AE27; font-size: 14px;"><strong>—&nbsp;成都美食&nbsp;—</strong></span>
                        </p>
                      </section>
                    </section>
                    <p>
                      <br/>
                    </p>
                    <section class="_135editor" data-tools="135编辑器" data-id="86301" style="position: relative; border: 0px none; padding: 0px;">
                      <section class="135bg" style="min-width: 100%; padding: 5px 25px;background-image: url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNoWjd3c3A5ejRXY0Nuekw2ZFV2UVFsb0dRMXZjNW5uU0dnenBMY3Nia0hvaWFaaFVDT2IwSEZRLzA/d3hfZm10PWpwZWc=); background-size:contain; background-position: 50% 50%; background-repeat: no-repeat;">
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="position: relative; border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNKc1lPdlVDa2RYa0xFRVhwVzlKTmpDRHRnOGQ1VWtNcElqOUltRmtBSlhYeTRrSHhtY21vUXcvMD93eF9mbXQ9cG5n" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left: 6px;">
                            <p>
                              <span style="color: #B5D78D;"><strong><span style="line-height: inherit; font-size: 16px; color: #92D050;">夫妻肺片</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">色泽红亮，质地软嫩，口味麻辣浓香。观之青红碧绿，津河暗涌。一大青瓷盘新拌的肺片端上桌，红油重彩，颜色透亮；把箸入口中，便觉麻辣鲜香、软糯爽滑，脆筋柔糜、细嫩化渣。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="position: relative; border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNwaGppYXBDMUFCelloaWNsMXJwRXQ4cURnb1RrWkZJN3ZnOWIydWZ3ZlFEYkk1Wm12UUxjTlBpY1EvMD93eF9mbXQ9cG5n" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left:6px;">
                            <p>
                              <span style="color: #E8587C;"><strong><span style="line-height: inherit; font-size: 16px;">酸辣豆花</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">酸辣豆花是四川成都、乐山等地有名的地方小吃。豆花在从前多以摊担形式经营，普遍流行于城市和农村，是一种历史悠久的民间小吃。</span>
                          </p>
                        </section>
                        <section class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">当然，酸辣豆花是豆花的一个品种，用酱油、醋、辣椒面、味精调成味汁，放入事先熬烫的豆花，撒上芽菜末、油酥黄豆、大头菜末和葱花即成。酸辣豆花口味酸辣咸鲜，豆花细嫩，配料酥香，味浓滚烫，别有风味。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <p style="text-align: justify;">
                          <br/>
                        </p>
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="position: relative; border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNzZEtuSVlNc3dwUWtZUFk4NEVvbEhZakgzOG9lOW9pYXh6NDlRbURtYmJBaWNYWFVhMXdXaDRpY0EvMD93eF9mbXQ9cG5n" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left:6px;">
                            <p>
                              <span style="color: #F3B338;"><strong><span style="line-height: inherit;">担担面</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">担担面是著名的成都小吃的之一，用面粉擀制成面条，煮熟，舀上炒制的猪肉末而成。成菜面条细薄，卤汁酥香，咸鲜微辣，香气扑鼻，十分入味。此菜在四川广为流传，常作为筵席点心。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <p style="text-align: justify;">
                          <br/>
                        </p>
                      </section>
                    </section>
                    <section class="_135editor" data-tools="135编辑器" data-id="86301" style="position: relative; border: 0px none; padding: 0px;">
                      <section class="135bg" style="min-width: 100%; padding: 5px 25px; background-image: url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNFcldTdzNCYlJQOTdiSUpKSjQ4QXM1MXN0cjBlemNlYUNidmxqdWhDQmxTU013Z2c2QTFJMVEvMD93eF9mbXQ9anBlZw==); background-size: contain; background-position: 50% 50%; background-repeat: no-repeat;">
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNSTlNyc0VvVlFHVXFjTUJ3NG9pYlRLYXdTOFBpY2JyNlcwbklUaHFaMThZR20yNEpuaWJpYjdPS3RBLzA/d3hfZm10PXBuZw==" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left: 6px;">
                            <p>
                              <span style="color: #B5D78D;"><strong><span style="line-height: inherit; color: #92D050;">龙抄手</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section class="_135editor" style="border: 0px none; padding: 0px; position: relative;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">龙抄手皮薄馅嫩，爽滑鲜香，汤浓色白，为蓉城小吃的佼佼者。龙抄手的得名与钟水饺不一样，并非老板姓龙，而是当初三个伙计在“浓花茶园”商议开抄手店，取“浓”的谐音“龙”为名，也寓有“龙腾虎跃”、生意兴“隆”之意。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="position: relative; border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNMbmdvVWljeWRkTGZ1QWliaWMyaEJudG82Y25rNXlQTDM2cWxOZUJya09Td1Bod3ZTalVLOEtDNXcvMD93eF9mbXQ9cG5n" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left:6px;">
                            <p>
                              <span style="color: #E8587C;"><strong><span style="line-height: inherit;">冒菜</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">冒菜，是成都的特色菜，“冒”字在这里是动词。准备一锅麻辣鲜香的汤汁，把菜用一个竹勺装好，一般一勺就是一份。在锅里煮熟，然后盛到碗里，顺便再舀一勺汤汁，再撒上点香菜、葱花和四川特有的豆豉，就成了成都最有名最特色的小吃“冒菜”。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <p style="text-align: justify;">
                          <br/>
                        </p>
                        <section class="_135editor" data-tools="135编辑器" data-id="86306" style="position: relative; border: 0px none; padding: 0px;">
                          <section style="width:40px;;display:inline-block;;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNyaEhkOUtyaWEzclkwdW5vNk5pYzdkaEtpYUp5bDVycFY1RXd1aWFJa1JSZ005RjZ3R3hpYkxVZkVUdy8wP3d4X2ZtdD1wbmc=" style="width: 100%;" data-width="100%" width="100%" height="auto" border="0" mapurl="" title="" alt=""/>
                          </section>
                          <section style="display:inline-block;vertical-align: top;margin-top:8px;margin-left:6px;">
                            <p>
                              <span style="color: #F3B338;"><strong><span style="line-height: inherit;">串串</span></strong></span>
                            </p>
                          </section>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="position: relative; border: 0px none; padding: 0px;">
                          <p style="text-align: justify; line-height: 1.75em;">
                            <span style="font-size: 14px; color: #9C8A7E;">“吃串串，数芊芊。”串串，是草根美食最大众化的体现，它实际上是火锅的前身或者另一种形式，所以人们又往往称其为小火锅。而在北方，串串多表现为麻辣烫的形式，以其独特的魅力和鲜明的特色遍布于全国众多城市，可以说只要有人的地方就有麻辣烫的存在，甚至在一定程度上，麻辣烫已成为四川味道的代表。</span>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="position: relative; border: 0px none; padding: 0px;"></section>
                        <section data-role="paragraph" class="_135editor" style="position: relative; border: 0px none; padding: 0px;"></section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px; position: relative;">
                          <p style="text-align: right;">
                            <span style="color: #9C8A7E; font-size: 12px;">声明：</span><span style="color: #9C8A7E; font-size: 12px; line-height: inherit;">文章内容摘自网络</span>
                          </p>
                          <p style="text-align: right;">
                            <span style="color: #9C8A7E; font-size: 12px;">图片来自网络 &nbsp;侵删</span>
                          </p>
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <p style="text-align:center">
                          <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWM5TEpCZWttWnZsMEl2RXdsc2VSa25teTRIcHRXRU9DV3hRbmlhdUpyWVFDTWRJbVRjcTdKVUp3LzA/d3hfZm10PXBuZw==?imageView2/2/w/200" title="小清新图标" data-id="3814" data-model="Image" style="width: 20px;height: auto !important;" alt=""/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWN0c0ROM0xKVU9Vc0FpYkdYbHdvNEpPVHF3VEtMc2liY1FyTlBlMmpza3k0aWFudHlON284SFBYSkEvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3813" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNmbU5raWJpYzR3MGliNDlhY3FDeVVPUU9qaWNqczhmY2FDUmpsVkpNdDhqTVpOdGZnOU53cFVha1Z3LzA/d3hfZm10PXBuZw==?imageView2/2/w/200" title="小清新图标" data-id="3812" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNKc1lPdlVDa2RYa0xFRVhwVzlKTmpDRHRnOGQ1VWtNcElqOUltRmtBSlhYeTRrSHhtY21vUXcvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3811" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNzZEtuSVlNc3dwUWtZUFk4NEVvbEhZakgzOG9lOW9pYXh6NDlRbURtYmJBaWNYWFVhMXdXaDRpY0EvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3810" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNwaGppYXBDMUFCelloaWNsMXJwRXQ4cURnb1RrWkZJN3ZnOWIydWZ3ZlFEYkk1Wm12UUxjTlBpY1EvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3809" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNMbmdvVWljeWRkTGZ1QWliaWMyaEJudG82Y25rNXlQTDM2cWxOZUJya09Td1Bod3ZTalVLOEtDNXcvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3807" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNSTlNyc0VvVlFHVXFjTUJ3NG9pYlRLYXdTOFBpY2JyNlcwbklUaHFaMThZR20yNEpuaWJpYjdPS3RBLzA/d3hfZm10PXBuZw==?imageView2/2/w/200" title="小清新图标" data-id="3805" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNyaEhkOUtyaWEzclkwdW5vNk5pYzdkaEtpYUp5bDVycFY1RXd1aWFJa1JSZ005RjZ3R3hpYkxVZkVUdy8wP3d4X2ZtdD1wbmc=?imageView2/2/w/200" title="小清新图标" data-id="3808" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWM5TEpCZWttWnZsMEl2RXdsc2VSa25teTRIcHRXRU9DV3hRbmlhdUpyWVFDTWRJbVRjcTdKVUp3LzA/d3hfZm10PXBuZw==?imageView2/2/w/200" title="小清新图标" data-id="3814" data-model="Image" style="width: 20px;" alt=""/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWN0c0ROM0xKVU9Vc0FpYkdYbHdvNEpPVHF3VEtMc2liY1FyTlBlMmpza3k0aWFudHlON284SFBYSkEvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3813" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNmbU5raWJpYzR3MGliNDlhY3FDeVVPUU9qaWNqczhmY2FDUmpsVkpNdDhqTVpOdGZnOU53cFVha1Z3LzA/d3hfZm10PXBuZw==?imageView2/2/w/200" title="小清新图标" data-id="3812" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/><img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNKc1lPdlVDa2RYa0xFRVhwVzlKTmpDRHRnOGQ1VWtNcElqOUltRmtBSlhYeTRrSHhtY21vUXcvMD93eF9mbXQ9cG5n?imageView2/2/w/200" title="小清新图标" data-id="3811" data-model="Image" alt="" style="line-height: inherit; width: 20px;"/>
                        </p>
                        <section data-role="paragraph" class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                      </section>
                    </section>
                  </section>
                  <section data-id="85996" class="_135editor" style="position: relative;">
                    <section style="text-align:center;padding: 10px 0px;background-color:#F7AB00;">
                      <section style="display:inline-block;width: 50%;text-align: right;padding-right: 5px;" data-width="50%">
                        <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pFTkdjZ21DQnRwWUtyM0xkbTZndGliaWNDaGpLQ2ljYkYwNE94V2dRUkVBZFQ3Y3M4VUFScHBYM2JCbVQ1SWZxaWFyampraWI3OHQ1OFl5QXcvMD93eF9mbXQ9cG5n" style="width: 120px; margin: 0px; height: auto !important;" width="120" height="auto" border="0" opacity="" mapurl="" title="" alt=""/>
                      </section>
                      <section style="display:inline-block;padding-left:5px;width: 50%;text-align: left;" data-width="50%">
                        <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhxMHEyY2diZ1hLODNndHF1RG5xbE5DbXFhYzBramZHNVRkaWM1OW14VEFKR3hBUG85aWNoSzd6UlB2MEFndkJHMkFKWXJPY2RiZlRWUS8w" style="width: 120px; margin: 0px;" width="100" height="" border="0" mapurl="" title="" alt=""/>
                      </section>
                      <section style=" text-align: center;margin-top: 6px;">
                        <span style="font-size: 14px; color: #FFFFFF;">更多精彩内容请扫码关注我们</span>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </div>
            <span>模板一</span>
          </li>
          <li>
            <div template-id="002">
              <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                <p>
                  <br/>
                </p>
              </section>
              <section data-id="87978" class="_135editor">
                <section class="_135editor">
                  <section class="_135editor">
                    <section style="padding: 20px; background-color: rgb(243, 240, 235);">
                      <section class="_135editor">
                        <p style="text-align: center;">
                          <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pHaWNNd1BGbkVFQ1NyVGZucUhpYVZkczhUMkVXUHlwR1NQNERCNzF2eVhXNHRKNGdHZTVxbnE3eVpEZ2tKRmpiUFJwVVJNb3RpY3puRmtBLzA/d3hfZm10PXBuZw=="/>
                        </p>
                      </section>
                      <section class="_135editor">
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section data-id="87943" class="_135editor">
                        <section class="layout" style="margin-right: auto; margin-left: auto;">
                          <section style="border-style: solid; -webkit-border-image: url(&quot;http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pHak11MlRHbGZZczA4elBNZXVPTGFXaWNvOHI3OFczUFhHeXlZYUc5dlMxYmZaVmwwaWJLU2dnRDU4akNpYm9jd09HSzh6WGxNUTlLUElnLzA/d3hfZm10PXBuZw==&quot;) 50 55 180 fill; border-width: 25px 25px 120px 40px; margin-right: auto; margin-left: auto;">
                            <section class="135brush" style="margin-right: -10px; margin-bottom: -50px; margin-left: -15px;" data-style="font-size: 14px; color: #9D7569;">
                              <p style="font-size: 14px; color: #9D7569;">
                                <br/>
                              </p>
                            </section>
                          </section>
                        </section>
                      </section>
                      <section class="_135editor">
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section class="_135editor">
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section class="_135editor" data-tools="135编辑器" data-id="87957">
                        <p style="text-align: center; text-indent: 2em;">
                          <img style="width: 80px;display: inline;" title="圆规分割线" src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2OWliNlNmR2lhUzdNUHZVMlBqakEzeGlhT0pXRDBYaktsM1lrR1lwMHJBZ0F2Mmp0b05zQ2JrczRnLzA/d3hfZm10PXBuZw=="/>
                        </p>
                        <p>
                          <br/>
                        </p>
                        <section class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                        <section data-id="87963" class="_135editor">
                          <section style="border-width: 30px;border-style:solid; -webkit-border-image: url(&quot;http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2MXpuNmliWjVyOHVDQTlDUkRpYnB5aGljRlpDQlNMcnF1a3c5dGF1ZFRFbWpFT1I3d0dvZUJpYm9tdy8wP3d4X2ZtdD1wbmc=&quot;) 20 fill; margin-top: 1em; color: rgb(135, 197, 253); line-height: 1.4; margin-left: 10px;">
                            <section class="135brush" data-style="color: #796F66; font-size: 14px;text-align: center; line-height: 1.75em;">
                              <p style="font-family: inherit; font-size: 14px; text-align: justify; line-height: 1.75em; text-indent: 2em;">
                                <span style="color: #796F66;"></span><span style="font-family: 微软雅黑; color: #6E655F;">我是幼苗，你是雨露，滋润我干枯的心田。我是小草，你是太阳，照耀我成长的路。谢谢您，老师! 我是幼苗,你是雨露,滋润我干涸的心田.我是小草,你是太阳,照耀我成长的路！</span>
                              </p>
                              <p style="font-family: inherit; font-size: 14px; text-align: justify; line-height: 1.75em;">
                                <br/>
                              </p>
                            </section>
                          </section>
                          <section style="margin-top: -25px;">
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2cFJyemZUMWNRbzI5VjZZNEYwaGlhanBHNDBaQUgzdDcxcjJQQWtpYkF1M1ZlYU5id0ZCcmlhYjlBLzA/d3hfZm10PXBuZw==" class="assistant"/>
                          </section>
                        </section>
                        <section class="_135editor">
                          <p>
                            <br/>
                          </p>
                        </section>
                      </section>
                      <section class="_135editor" style="position: relative;">
                        <p style="font-family: inherit; font-size: 14px; text-align: justify; line-height: 1.75em; text-indent: 2em;">
                          <span style="color: #796F66;"></span><span style="font-family: 微软雅黑; color: #6E655F;">夏日送杯冰红茶，让它带走您的炎热;冬日送杯热露露，让它给您温暖;此时送杯高兴就好，祝福您百事可乐! 希望今天是一个艳阳天，明天会更好!</span><span style="font-family: inherit; line-height: 1.4; color: #796F66;"></span>
                        </p>
                        <p style="font-family: inherit; font-size: 14px; line-height: 1.75em;">
                          <br/>
                        </p>
                        <section data-id="87948" class="_135editor">
                          <section class="135bg" style="width: 100%; display: inline-block; height: auto !important; background-image: url(&quot;http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pHaWNNd1BGbkVFQ1NyVGZucUhpYVZkczhYMm10Tjh3VUVFQ3JLSDlSdEowM1g4R0dFbXVmUXNBZ1MxNzduczkyRURNcXRoWGppYlNoMmN3LzA/d3hfZm10PWpwZWc=&quot;); background-size: cover; background-position: 50% 50%; background-repeat: no-repeat;" data-width="100%">
                            <p style="text-align: center; line-height: 0em;">
                              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pHaWNNd1BGbkVFQ1NyVGZucUhpYVZkczhmZ0tDMWptVTBvcEZOeHJkaWNZeHRvaWJoTkQ5U1hZaWJtdmE5QkxabkxlTnhDM0xXY285c3dQQkEvMD93eF9mbXQ9cG5n" style="width: 100%;" class="assistant" data-width="100%" width="100%" height="" border="0" mapurl="" title="" alt=""/>
                            </p>
                          </section><br/>
                        </section>
                        <p style="font-family: inherit; font-size: 14px; line-height: 1.75em; text-align: center;">
                          <br/>
                        </p>
                        <p style="font-family: inherit; font-size: 14px; line-height: 1.75em; text-align: justify; text-indent: 2em;">
                          <span style="color: #796F66;"></span><span style="color: #6E655F;">希望今天，所有的老师都会从心里微笑;为自己自豪吧，因为你是老师! 希望今天，所有的老师都会从心里微笑，为了桃李满天下!只要老师快乐，我们就快乐!</span><span style="font-family: inherit; line-height: 1.4; color: #796F66;"></span>
                        </p>
                        <p style="font-family: inherit; font-size: 14px; line-height: 1.75em;">
                          <br/>
                        </p>
                        <section data-id="87950" class="_135editor">
                          <section>
                            <p style="text-align: center;">
                              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pHaWNNd1BGbkVFQ1NyVGZucUhpYVZkczhhWmliazRhRUt4Q09Bc1dVU0ZZWHdFTzB4SXo2NTZYR1FHQmZIT2w0eldWVTZQdWZ3aGZKdlhRLzA/d3hfZm10PWpwZWc=" style="width: 100%;" data-width="100%" width="100%" height="" border="0" mapurl="" title="" alt=""/>
                            </p>
                          </section>
                          <section style="margin-top:-50px;margin-left:-25px;transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);">
                            <p>
                              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2eUFJTDNDU010SXlOUkk5N25VbVc0alFNRk1FTnFFR2JxajhkbnM0T1AwZXp0b3F0UnZ6cjBRLzA/d3hfZm10PXBuZw==" style="width:100px;"/>
                            </p>
                          </section>
                        </section>
                        <p style="font-family: inherit; font-size: 14px; line-height: 1.75em;">
                          <br/>
                        </p>
                        <p style="font-family: inherit; font-size: 14px; text-align: justify; line-height: 1.75em; text-indent: 2em;">
                          <span style="color: #796F66;"></span><span style="color: #6E655F;">无尽的恩情，永远铭记心中。每个成长的日子里，我都要祝福你，我的老师。 我尊敬的老师，我的成功是您给予的支持，千言万语一声“谢谢”--您是我永远的老师，永远的朋友!</span><span style="font-family: inherit; line-height: 1.4; color: #796F66;"></span>
                        </p>
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section class="_135editor">
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section class="_135editor" data-tools="135编辑器" data-id="87955">
                        <p style="text-align: center;">
                          <img data-id="87955" style="display: inline;" title="1+2分割线" src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2NW54aFJsY3ppYWliODJlRUVYZXJjUjFFaFBjc3RITHVDM0hob2ZEZFlMcFlNamNndVBHOXNvSHcvMD93eF9mbXQ9cG5n"/>
                        </p>
                      </section>
                      <section class="_135editor">
                        <p>
                          <br/>
                        </p>
                      </section>
                      <section data-id="87962" class="_135editor">
                        <section style="display: inline-block; width: 40%; margin-top: 15px; vertical-align: top;" data-width="40%">
                          <p>
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhxMHEyY2diZ1hLODNndHF1RG5xbE5DbXFhYzBramZHNVRkaWM1OW14VEFKR3hBUG85aWNoSzd6UlB2MEFndkJHMkFKWXJPY2RiZlRWUS8w"/>
                          </p>
                        </section>
                        <section style="display: inline-block; width: 60%; margin-left: -30px;" data-width="60%">
                          <p>
                            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9wbmcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2bXpYRjRJUGVUTEZ3VFNlbkRCa2lhTlZWTUtXU2FEWmhGSzJ1cVlZNmZicmtrYlJqdTl0YXpBZy8wP3d4X2ZtdD1wbmc=" class="assistant"/>
                          </p>
                        </section>
                        <section style="margin-top: -55px; margin-left: 55%; line-height: 1.5em;">
                          <p>
                            <span style="color: #594F49; font-size: 14px;">135编辑器</span>
                          </p>
                          <p>
                            <span style="font-size: 14px;color:#594F49" class="135brush" data-brushtype="text">祝所有老师节日快乐!!</span>
                          </p>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
                <p>
                  <br/>
                </p>
              </section>
            </div>
            <span>模板二</span>
          </li>
          <li>
            <div template-id="003">
              <section data-role="paragraph" class="_135editor" style="border: 0px none; padding: 0px;">
                <p>
                  <br/>
                </p>
              </section>
              <section class="_135editor" data-tools="135编辑器" data-id="85594">
                <section class="layout" style="margin: 0.5em auto 1em; padding: 0px; box-sizing: border-box; min-width: 0px; font-size: 15px; word-wrap: break-word !important;">
                  <section style="color: inherit; text-align: right; box-sizing: border-box; padding: 0px; font-size: 14px;">
                    <section style="margin-right: 15px; padding: 0px; box-sizing: border-box; display: inline-block; vertical-align: top; height: 6em; width: 6em; border-radius: 50%; border: 5px solid rgba(0, 0, 0, 0.2); font-family: inherit; font-weight: inherit; text-decoration: inherit; font-size: 1.6em; color: inherit; word-wrap: break-word !important;">
                      <section data-role="circle" style="border-radius: 100%;overflow: hidden;margin: 0 auto;width:100%;padding-bottom:100%;height:0px;background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUWFrMHY1Um9SaWNsOWxOcmlheUlyOG83aWF5NFpBekMySGliWkxaRURUOTZON0NWT2dEUHQzajRCSXcvMD93eF9mbXQ9anBlZw==);background-position:50% 50%;background-size: cover;" data-width="100%">
                        <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUWFrMHY1Um9SaWNsOWxOcmlheUlyOG83aWF5NFpBekMySGliWkxaRURUOTZON0NWT2dEUHQzajRCSXcvMD93eF9mbXQ9anBlZw==" style="opacity:0;"/>
                      </section>
                    </section>
                  </section>
                  <section class="135brush" data-autoskip="true" data-style="white-space: normal; font-size: 14px; text-align: left; line-height: 2em;color: rgb(0, 0, 0); font-size: 14px;" style="margin: -8.5em 0px 1em; padding: 10px 50% 10px 15px; border: 0px solid rgb(229, 243, 208); font-size: 14px; font-weight: inherit; text-align: left; text-decoration: inherit; box-sizing: border-box; overflow: hidden; min-height: 105px; background-color: rgb(229, 243, 208);">
                    <p style="color: inherit; white-space: normal; font-size: 14px; text-align: left; line-height: 2em;">
                      <span style="color:#000000; font-size:14px">我可以是标题</span>
                    </p>
                    <p style="color: inherit; white-space: normal; font-size: 14px; line-height: 2em;">
                      <span style="color:#000000; font-size:14px">也可以是正文</span>
                    </p>
                    <p style="white-space: normal; font-size: 14px; line-height: 2em;">
                      三行内容效果最佳
                    </p>
                  </section>
                </section>
              </section>
            </div>
            <span>模板三</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
  @import "./css/global.css";
</style>
<script>
  import utils from "../../assets/js/utils"
  import {STYLE_TYPE,requestStyle,getStyleType} from "./js/editor"

  export default {
    data: function () {
      return {
        isShowTabBar: true,
        styleNavClass: [
          {active:true},
          {active:false},
          {active:false},
          {active:false}
        ],

        styleDataArrs: {
          "title": [],
          "text": [],
          "image-text": [],
          "table": []
        },
      }
    },


    mounted: function () {
      var me = this;

      requestStyle(STYLE_TYPE.TITLE, 1, 20).then(function (resMsg) {
        me.pushStyle(resMsg.result.type, resMsg.result[resMsg.result.type])
      }).catch(function (e) {
        console.error(e)
      })
    },

    methods: {
      insertTemplate: function(evt) {
        console.log(evt.target);
      },
      /**
       * 获取指定类型的样式列表
       * @param type
       * @returns {*}
       */
      getStyleDataArr: function (type) {
        if(!this.styleDataArrs[type]) {
          this.styleDataArrs[type] = []
        }
        return this.styleDataArrs[type]
      },

      pushStyle: function (styleType, styleArr, isAppend) {
        var tmpStyleArr = this.getStyleDataArr(styleType)
        if(tmpStyleArr) {
          if(!isAppend) {
            tmpStyleArr.splice(0,tmpStyleArr.length)
          }
          for(var i=0; i<styleArr.length; i++) {
            tmpStyleArr.push(styleArr[i])
          }
        }
      },

      changeTabbar: function (evt) {
        var $target = $(utils.getEventTarget(evt));
        var tabIdx = $target.attr("tab-idx")
        if(tabIdx === "") {
          this.isShowTabBar = true
        }
        else {
          this.isShowTabBar = false
        }
      },


      changeSidebar: function (index, evt) {
        var styleType = getStyleType(index)
        for (var i=0; i<this.styleNavClass.length; i++) {
          this.styleNavClass[i].active = false;
        }
        this.styleNavClass[index].active = true;
        //var $target = $(utils.getEventTarget(evt));
        console.log(evt.target)

        var me = this;

        var tmpStyleArr = this.getStyleDataArr(styleType)
        if(tmpStyleArr.length > 0) {
          return;
        }

        requestStyle(styleType,1,20).then(function (resMsg) {
          me.pushStyle(styleType, resMsg.result[styleType])
        }).catch(function (e) {
          console.error(e)
        })
      },

      selectedStyle: function(styleType,index) {
        var styleArr = this.getStyleDataArr(styleType)
        if(styleArr) {
          var styleHtml = styleArr[index];
          this.$emit("clickstyle",{styleHtml:styleHtml,styleType:styleType})
        }
      },

      selectedStyle2: function (evt) {

      },

      onScroll: function (e, position) {
        var offsetHeight = $(utils.getEventTarget(e)).find('ul').height() - $(utils.getEventTarget(e)).height();
        var scrollTop = position.scrollTop;
        if (scrollTop == 0) {
          console.log('滚动到顶部。。。')
        }
        if (scrollTop == offsetHeight) {
          console.log('滚动到底部。。。')
        }
      }
    }
  }
</script>
