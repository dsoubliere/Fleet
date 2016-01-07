'use strict';
var initFleet = function(options) {
    var s = $.extend({
		nds: '.fleet',
        affectedChildren: '.item',
        readyClass: 'ready'
    }, options );
    var wH, wW,
        scrolled = 0,
        nds = [],
        idx = [],
        events = $.extend({
            repos: function(i, nds, perc, start, end, contW, contH) {
                var durLeft = Math.abs(end[0]-start[0])*(end[0]>start[0]?perc:1-perc)+Math.min(end[0],start[0]),
                    durTop = Math.abs(end[1]-start[1])*(end[1]>start[1]?perc:1-perc)+Math.min(end[1],start[1]);
                this.style.left = nds.ndOS[i].left+Math.round(durLeft*contW)+'px';
                this.style.top = nds.ndOS[i].top+Math.round(durTop*contH)+'px';
            },
            class: function(nds, perc, cls) {
                nds.nds[(perc>0&&perc<1? 'add':'remove')+'Class'](cls);
            },
            move: function(nds, perc, start, end) {
                nds.nds.each(function(i) {
                    events.repos.call(this, i, nds, perc, start, end, wW, wH);
                });
            },
            shift: function(nds, perc, start, end) {
                nds.nds.each(function(i) {
                    events.repos.call(this, i, nds, perc, start, end, $(this).width(), $(this).height());
                });
            },
            opacity: function(nds, perc, start, end) {
                nds.nds.css('opacity', start + Math.round((end-start)*perc*100)/100);
            }
    }, s.events ),
        fleetData = {
            ind: 'organic',
            ofst: 0,
            len: 1,
            points: []
        };


    var checkPoints = function() {
        var sT = $(window).scrollTop(),
            top = 0, pxOfst = 0, ofst = 0, end = 0;
        for (var i=0; i<nds.length; i++) {
            top = sT + (nds[i].ofst * wH),
				pxOfst = (nds[i].nds[0].style && nds[i].nds[0].style.top? nds[i].nds[0].style.top.match(/\d+/, '')*1 : 0),
                ofst = nds[i].ind == 'organic' ? (nds[i].nds.length > 0 ? nds[i].nds.offset().top - pxOfst:0) : idx[nds[i].ind].ofst;
                end = (ofst+ nds[i].len*wH);
            var curProg = Math.min(Math.max((top-ofst) / (end-ofst), 0), 1);
            if (nds[i].progress !== curProg) {
                nds[i].nds[(curProg%1 == 0?'remove':'add')+'Class']('inProgress');
                nds[i].progress = curProg;
                for (var p=0; p<nds[i].points.length; p++) {
                    var pDur = Math.abs(nds[i].points[p][2]*wH),
                        pEnd = nds[i].points[p][2] > 0 ? ofst + nds[i].points[p][1]*wH + pDur : end - nds[i].points[p][1]*wH,
                        pStart = nds[i].points[p][2] > 0 ? ofst + nds[i].points[p][1]*wH : end - pDur;
                    if (nds[i].points[p][2] > 0) console.log(end - nds[i].points[p][1]*wH);
                    events[nds[i].points[p][0]](nds[i], 
                                                nds[i].points[p][2]==0 ? 0.5 : Math.min(Math.max(top-pStart, 0)/pDur, 1),
                                                nds[i].points[p][3], 
                                                nds[i].points[p][4]);
                    var pprog = (nds[i].points[p][2] > 0 ? nds[i].points[p][1] : nds[i].len+nds[i].points[p][2])/nds[i].len;
                }
            }
        }
    },
    calculateIdx = function() {
        for (var i=0; i<nds.length; i++) {
            if (nds[i].ind == 'organic') {
                nds[i].flow = 0;
                if (nds[i].nds.length > 0)
                    nds[i].flow = nds[i].nds.offset().top - nds[i].nds[0].style.top;
            } else {
                if (typeof idx[nds[i].ind] !== 'object') idx[nds[i].ind] = {ofst: 0, len: 0};
                idx[nds[i].ind].len = Math.max(idx[nds[i].ind].len, nds[i].len*wH, nds[i].fleet.height());
            }
        }
        for (var i=0, t = 0; i<idx.length; i++) {
            idx[i].ofst = t;
            t += idx[i].len;
        }
        $('body').css('min-height', t);
    }, sizeW = function() {
        wW = $(window).width(),
        wH = $(window).height();

        calculateIdx();
        checkPoints();
    };

    $(s.nds).addClass(s.readyClass).each(function() {
        var fl = $(this).data('fleet').replace(/'/g, '"'),
            dt = JSON.parse(fl);
        dt.fleet = $(this);
        dt.nds = $(this).children(s.affectedChildren);
        dt.ndOS = Array();
        for (var i=0; i<dt.nds.length; i++)
            dt.ndOS[i] = {top:dt.nds[i].style.top, left:dt.nds[i].style.left};
        dt.progress = 0;
        nds.push($.extend({}, fleetData, dt));
    });

    sizeW();

    $(window).on('scroll.wayPoints', checkPoints).on('resize.wayPoints', sizeW);
};
