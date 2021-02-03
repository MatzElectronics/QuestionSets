
function drawChromosome(dragon) {
    $('#chromosome' + dragon).innerHTML = dragons.chromosome.base.replace(/id="p/g, `id="c${dragon}-`).replace(/id="gene-/g, `id="c${dragon}-gene-`);
    Object.keys(dragons.chromosome.chromatids).forEach(function (e) {
        $(`#c${dragon}-${e}`).setAttribute('d', dragons.chromosome.chromatids[e]);
    });
}

function drawDragon(dragon) {
    $(`#dragon${dragon}`).innerHTML = dragons.base.replace(/id="p/g, `id="d${dragon}-`);

    dragons.male.forEach((p) => {
        $(`#d${dragon}-` + p[0]).setAttribute(`d`, p[1]);
    });

    addClass(`#dragon${dragon} .primary`, `blue`);
    addClass(`#dragon${dragon} .secondary`, `red`);
    addClass(`#dragon${dragon} .tertiary`, 'yellow');
}

const getColor = {
    primary: function (dragon) {
        return hasClass(`#dragon${dragon} .skin`, 'blue') ? 'blue' :
            'green';
    },
    secondary: function (dragon) {
        return hasClass(`#dragon${dragon} .skin`, 'blue') ? 'red' :
            'purple';
    }
}

function setColor(dragon, blueOrGreen) {
    if (blueOrGreen !== 'blue') {
        blueOrGreen = 'green';
    }
    let oldPrimaryColor = getColor.primary(dragon);
    let oldSecondaryColor = oldPrimaryColor === 'blue' ? 'red' : 'purple';
    let newPrimaryColor = oldPrimaryColor === 'blue' ? 'green' : 'blue';
    let newSecondaryColor = oldPrimaryColor === 'blue' ? 'purple' : 'red';
    if (blueOrGreen !== oldPrimaryColor) {
        removeClass(`#dragon${dragon} .primary`, oldPrimaryColor);
        addClass(`#dragon${dragon} .primary`, newPrimaryColor);
        removeClass(`#dragon${dragon} .secondary`, oldSecondaryColor);
        addClass(`#dragon${dragon} .secondary`, newSecondaryColor);

        let theDragon = $(`#dragon${dragon}`);
        if (theDragon.hasSpikes === false) {
            dragons.spikes.remove(dragon)
        }
        if (theDragon.hasClaws === false) {
            dragons.claws.remove(dragon)
        }
        if (theDragon.hasHorns === false) {
            dragons.horns.remove(dragon)
        }
        if (theDragon.hasSpots === false) {
            dragons.spots.remove(dragon)
        }
        if (theDragon.hasWings === false) {
            dragons.wings.remove(dragon)
        }
    }
}

function setDragon(dragon, genotype) {
    [
        ['color', 'c'],
        ['spikes', 'p'],
        ['claws', 't'],
        ['horns', 'h'],
        ['spots', 's'],
        ['wings', 'w']
    ].forEach((trait) => {
        let traitGenes = genotype.replace((new RegExp(`[^${trait[1]}]+`, 'gi')), '');
        if (traitGenes.length > 0) {
            if (traitGenes.indexOf(trait[1].toUpperCase()) > -1) {
                if (dragons[trait[0]].dominant) {
                    dragons[trait[0]].add(dragon);
                } else {
                    dragons[trait[0]].remove(dragon);
                }
            } else if (traitGenes.indexOf('' + trait[1] + trait[1]) > -1) {
                if (dragons[trait[0]].dominant) {
                    dragons[trait[0]].remove(dragon);
                } else {
                    dragons[trait[0]].add(dragon);
                }
            }
        }
    });

    let genderGenes = genotype.replace(/[^xXyY]/g, '');
    if (genderGenes.length > 0) {
        genderGenes = genderGenes.toUpperCase().indexOf('Y') > -1 ? 'XY' : 'XX';
    }

    dragons.gender.set(dragon, genderGenes);
}

// TODO: fix this function
function formatGenotype(genotype) {
    let formattedGenotype = '';
    let genes = genotype.split('').sort();
    for (let i = 0; i < genes.length; i++) {
        if (genes[i].toLowerCase() === genes[i + 1].toLowerCase() && genes[i].toLowerCase() !== 'x' && genes[i].toLowerCase() !== 'y') {
            if (genes[i] !== genes[i + 1]) {
                formattedGenotype += genes[i].toUpperCase() + genes[i].toLowerCase();
            } else {
                formattedGenotype += genes[i] + genes[i + 1];
            }
        } else if ((genes[i].toLowerCase() === 'x' || genes[i].toLowerCase() === 'y') && (genes[i + 1].toLowerCase() === 'x' || genes[i + 1].toLowerCase() === 'y')) {
            if (genes[i] === 'y' || genes[i + 1] === 'y') {
                formattedGenotype += 'XY';
            } else {
                formattedGenotype += 'XX';
            }
        }
    }
    return formattedGenotype;
}

function breedDragons(genotype1, genotype2, offspringCount) {
    let offspring = [];

    let allele1 = genotype1.replace(/[^xy]+/gi, '')[1].toUpperCase();
    let allele2 = genotype2.replace(/[^xy]+/gi, '')[1].toUpperCase();

    if (allele1 === allele2 || offspringCount < 1) {
        return;
    }

    for (let i = 0; i < offspringCount; i++) {
        let traits = ['h','s','w','t','c','p'];
        let genotype = '';
        traits.forEach((t) => {
            let alleles1 = genotype1.replace((new RegExp(`[^${t}]+`, 'gi')), '');
            let alleles2 = genotype2.replace((new RegExp(`[^${t}]+`, 'gi')), '');

            genotype += '' + alleles1[Math.random() < 0.5 ? 0 : 1] + alleles2[Math.random() < 0.5 ? 0 : 1];
        });
        if (Math.random() < 0.5) {
            genotype += 'XY';
        } else {
            genotype += 'XX';
        }
        offspring.push(genotype);
    }

    return offspring;
}

function getRandomGenotype(traits) {
    let genotype = '';
    if (!traits) {
        traits = 'cpthswx';
    } else {
        traits = traits.toLowerCase().replace(/[^cpthswx]/g, '');
    }
    traits.split('').forEach((t) => {
        if (t !== 'x') {
            for (let i = 0; i < 2; i++) {
                if (Math.random() < 0.5) {
                    genotype += t.toUpperCase();
                } else {
                    genotype += t;
                }
            }
        } else {
            if (Math.random() < 0.5) {
                genotype += 'XY';
            } else {
                genotype += 'XX';
            }
        }
    });
    return genotype;
}

function randomDragon(dragon, setChromosomes) {
    let genotype = getRandomGenotype()
    setDragon(dragon, genotype);
    if (setChromosomes !== false) {
        setChromosome(dragon, genotype)
    }
    return genotype;
}

function setupGeneListener(dragon) {
    setTimeout(() => {
        'hswtcp'.split('').forEach((g) => {
            ['r', 'l'].forEach((s) => {
                let currentElement = `#c${dragon}-gene-${s}${g}`
                $(currentElement).addEventListener('click', (e) => {
                    let genotypeElement = $(`#c${dragon}-gene-label-${g}`);
                    let currentText = genotypeElement.innerHTML.split('');
                    if (hasClass(currentElement, 'dominant')) {
                        addClass(currentElement, 'recessive');
                        removeClass(currentElement, 'dominant');
                        currentText[s === 'r' ? 1 : 0] = g.toLowerCase();
                    } else {
                        removeClass(currentElement, 'recessive');
                        addClass(currentElement, 'dominant');
                        currentText[s === 'r' ? 1 : 0] = g.toUpperCase();
                    }
                    genotypeElement.innerHTML = currentText.join('');

                    setDragon(dragon, getChromosome(dragon));
                    return getChromosome(dragon);
                });
            });
        });

        $(`#c${dragon}-gene-xy-button`).addEventListener('click', (e) => {
            let currentText = $(`#c${dragon}-gene-label-xy2`).innerHTML.toUpperCase();
            if (currentText[0] === 'X') {
                $(`#c${dragon}-gene-label-xy2`).innerHTML = 'Y';
                $(`#c${dragon}-xy2`).setAttribute('d', dragons.chromosome.chromatids.xy2);
            } else {
                $(`#c${dragon}-gene-label-xy2`).innerHTML = 'X';
                $(`#c${dragon}-xy2`).setAttribute('d', dragons.chromosome.chromatids.xy1.replace(/M61 /g, 'M103 '));
            }

            setDragon(dragon, getChromosome(dragon));
            return getChromosome(dragon);
        });
    }, 250);
}

function getChromosome(dragon) {
    let traits = ['h','s','w','t','c','p','xy1','xy2'];
    let genotype = '';
    traits.forEach((t) => {
        genotype += $(`#c${dragon}-gene-label-${t}`).innerHTML;
    });
    return genotype; //formatGenotype(genotype);
}

function setChromosome(dragon, genotype) {
    let traits = ['h','s','w','t','c','p'];
    traits.forEach((t) => {
        let alleles = genotype.replace((new RegExp(`[^${t}]+`, 'gi')), '');
        $(`#c${dragon}-gene-label-${t}`).innerHTML = alleles;
        ['l', 'r'].forEach((s) => {
            let geneElement = $(`#c${dragon}-gene-${s}${alleles.toLowerCase()[0]}`);
            if (alleles[s === 'r' ? 1 : 0] === alleles[s === 'r' ? 1 : 0].toLowerCase()) {
                addClass(geneElement, 'recessive');
                removeClass(geneElement, 'dominant');
            } else {
                removeClass(geneElement, 'recessive');
                addClass(geneElement, 'dominant');
            }
        });
    });            

    let allele = genotype.replace(/[^xy]+/gi, '')[1].toUpperCase();
    $(`#c${dragon}-gene-label-xy2`).innerHTML = allele;
    if (allele === 'Y') {
        $(`#c${dragon}-xy2`).setAttribute('d', dragons.chromosome.chromatids.xy2);
    } else {
        $(`#c${dragon}-xy2`).setAttribute('d', dragons.chromosome.chromatids.xy1.replace(/M61 /g, 'M103 '));
    }

    return getChromosome(dragon);
}


const dragons = {
    color: { // Cc
        dominant: true,
        add: function (dragon) {
            setColor(dragon, 'blue');
        },
        remove: function (dragon) {
            setColor(dragon, 'green');
        }
    },
    gender: { // XX or XY
        set: function (dragon, gender) {
            dragons[gender.toLowerCase() === 'xy' ? 'male' : 'female'].forEach((p) => {
                $(`#d${dragon}-${p[0]}`).setAttribute('d', p[1]);
            });
        }
    },
    spikes: { // Pp
        dominant: false,
        add: function (dragon) {
            $(`#dragon${dragon}`).hasSpikes = true;
            removeClass(`#dragon${dragon} .spikes`, 'clear');
            addClass(`#dragon${dragon} .spikes`, getColor.secondary(dragon));
        },
        remove: function (dragon) {
            $(`#dragon${dragon}`).hasSpikes = false;
            removeClass(`#dragon${dragon} .spikes`, getColor.secondary(dragon));
            addClass(`#dragon${dragon} .spikes`, 'clear');
        }
    },
    claws: { // Tt
        dominant: true,
        add: function (dragon) {
            $(`#dragon${dragon}`).hasClaws = true;
            removeClass(`#dragon${dragon} .claws`, 'clear');
            addClass(`#dragon${dragon} .claws`, 'yellow');
        },
        remove: function (dragon) {
            $(`#dragon${dragon}`).hasClaws = false;
            removeClass(`#dragon${dragon} .claws`, 'yellow');
            addClass(`#dragon${dragon} .claws`, 'clear');
        }
    },
    horns: { // Hh
        dominant: false,
        add: function (dragon) {
            $(`#dragon${dragon}`).hasHorns = true;
            removeClass(`#dragon${dragon} .horns`, 'clear');
            addClass(`#dragon${dragon} .horns`, 'yellow');
        },
        remove: function (dragon) {
            $(`#dragon${dragon}`).hasHorns = false;
            removeClass(`#dragon${dragon} .horns`, 'yellow');
            addClass(`#dragon${dragon} .horns`, 'clear');
        }
    },
    spots: { // Ss
        dominant: false,
        add: function (dragon) {
            $(`#dragon${dragon}`).hasSpots = true;
            removeClass(`#dragon${dragon} .spots`, 'clear');
            addClass(`#dragon${dragon} .spots`, getColor.primary(dragon));
        },
        remove: function (dragon) {
            $(`#dragon${dragon}`).hasSpots = false;
            removeClass(`#dragon${dragon} .spots`, getColor.primary(dragon));
            addClass(`#dragon${dragon} .spots`, 'clear');
        }
    },
    wings: { // Ww
        dominant: true,
        add: function (dragon) {
            $(`#dragon${dragon}`).hasWings = true;
            removeClass(`#dragon${dragon} .wing`, 'clear');
            addClass(`#dragon${dragon} .wing`, getColor.primary(dragon));
        },
        remove: function (dragon) {
            $(`#dragon${dragon}`).hasWings = false;
            removeClass(`#dragon${dragon} .wing`, getColor.primary(dragon));
            addClass(`#dragon${dragon} .wing`, 'clear');
        }
    },
    base: '<path id="p1" class="primary medium wing" d="M429 1656c123-9 289 207 223 349 200-43 443 154 420 264 132-145 518-128 746-44-275-169-502-681-592-713-89-32-797 144-797 144" />' +
        '<path id="p2" class="primary dark wing" d="M1932 2368c-105-11-61-86-105-117-43-32-402-243-454-310-53-67-222 358-358 345-59-5 294-354 214-436-94-98-594 227-618 167-36-85 661-345 556-435-104-89-798 134-769 80 29-55 740-253 893-204 154 49 134 375 363 496 230 122 405 110 444 220 31 84-55 205-166 194" />' +
        '<path id="p3" class="primary medium wing" d="M2021 2118c54 12 81 94 0 159s-82-20-147-58c-65-39-293-186-430-321-89-88-170 211-387 341 81-63 278-341 218-436-61-96-554 196-581 165s535-249 511-385c-23-136-465-19-641 18 223-104 632-184 737-141 106 43 94 167 212 331 202 282 445 312 508 327" />' +
        '<path id="p4" class="primary light wing" d="M1309 1459c56 39 100 153 88 192s-94-86-155-112c-60-26-179-29-163-54s177-63 230-26" />' +
        '<path id="p5" class="primary light wing" d="M1040 1650c-42-49-435 36-461 62 60 42 120 155 101 207 127-88 419-201 360-269m-236 352c104 2 211 95 247 170 59-82 158-196 116-245-41-47-293 40-363 75m717 112c-123-27-176-58-197-63s-107 94-122 121c113-52 292-63 319-58" />' +
        '<path id="p6" class="secondary medium spikes"  />' +
        '<path id="p7" class="secondary dark spikes"  />' +
        '<path id="p8" class="primary dark skin"  />' +
        '<path id="p9" class="primary medium skin"  />' +
        '<path id="p10" class="tertiary dark claws" d="M2517 3166c24-21 93-7 94 37 1 21-44 60-78 57-33-2-38-75-16-94m83 18c23-20 93-7 94 37 0 22-45 60-79 58-33-3-37-75-15-95m119 35c4-27 58-51 83-22 13 14 4 52-19 69-24 17-68-22-64-47" />' +
        '<path id="p11" class="primary dark skin"  />' +
        '<path id="p12" class="primary medium skin"  />' +
        '<path id="p13" class="secondary dark belly"  />' +
        '<path id="p14" class="secondary medium belly"  />' +
        '<path id="p15" class="primary dark skin" d="M2318 2314c36 129 140 784 201 823 44 28 87 80 87 141 0 106-295 144-406 54-111-89-264-641-195-898m-418 125c42-67 164-145 277-74 288 179 0 691 48 710 64 17 138 114 97 180-41 67-397 21-480-76-59-69-33-109-17-158 16-48-71-182 6-432" />' +
        '<path id="p16" class="primary medium skin" d="M2245 2238c-167-70-223 104-184 415 38 311 118 565 191 631s309 51 331-18c12-41-25-100-80-115-94-24-203-891-258-913m-553 262c-78 56-163 437-44 700 19 42 186 22 214 5 46-26 124-495 69-631-47-114-188-111-239-74m-25 684c48-18 132-8 220 18 88 25 129 94 98 127-30 33-270 5-331-38-61-44-19-95 13-107" />' +
        '<path id="p17" class="primary light skin" d="M2391 3155c-87 19-122 71-76 112 60 53 229-18 242-51s-60-85-166-61m-564 38c-89-4-137 37-103 88 44 67 225 43 247 14 21-28-36-97-144-102" />' +
        '<path id="p18" class="secondary medium spikes" d="M1002 3027c-31-41-181 106-162 158 15 39 102 81 138 71 47-13 44-203 24-229m99 525c37-13-35-158-78-156-31 1-83 55-85 84-1 37 139 81 163 72m281 149c5 30-122 33-136 3-11-22 7-78 27-89 25-15 106 66 109 86m293 29c15 21-77 73-100 57-16-12-25-61-15-77 13-21 104 7 115 20m284-7c18 10-33 76-54 70-16-3-37-36-34-50 3-19 77-27 88-20" />' +
        '<path id="p19" class="secondary dark spikes" d="M885 3182c6-28 95-135 118-83 22 53-4 139-33 147-30 8-91-28-85-64" />' +
        '<path id="p20" class="secondary medium spikes" d="M970 3427c42-45 46-13 15 25-32 38-58 21-15-25m278 271c6 15 36-71 28-79-9-7-44 44-28 79m327 84c10 8-2-67-11-69-9-3-15 49 11 69m328 8c10 3-21-48-29-47-7 1 5 41 29 47" />' +
        '<path id="p21" class="tertiary dark claws" d="M2578 3220c49 4 75 75 56 106-15 24-117-17-123-38-9-32 29-70 67-68m-82 43c48 10 65 84 42 112-18 22-113-32-117-54-5-32 38-66 75-58m-124 35c25 11 31 80 3 100-29 19-91-37-84-66 7-30 52-47 81-34m-370-12c47 14 58 89 33 115-20 20-111-41-113-63-2-32 44-62 80-52m-89 25c45 19 46 95 18 118-22 18-104-55-104-77 2-32 51-56 86-41m-129 8c22 16 14 85-18 99-31 13-81-55-68-82 13-28 60-35 86-17" />' +
        '<path id="p22" class="tertiary light claws" d="M2644 3176c59 16-5 59-27 58s-26-72 27-58m149 20c12 10-4 47-16 49s-41-27-37-41 38-21 53-8m-201 28c21 9 42 56 31 66-11 11-76-19-85-34-10-16 31-43 54-32m-85 41c20 9 41 56 30 67-11 10-75-19-85-35-9-16 31-43 55-32m-134 37c11 6 14 62-4 61s-39-33-36-47c3-13 31-20 40-14m-358-10c19 13 30 64 17 72s-71-35-77-52 39-35 60-20m-92 23c18 13 29 64 16 72s-70-35-76-52 39-35 60-20m-138 8c9 8 1 64-17 60-18-5-31-41-26-54 6-12 34-13 43-6" />' +
        '<path id="p23" class="secondary medium belly" d="M1347 3190c-82 54-86 241 96 345 183 105 513 105 612 30-185-5-612-64-604-279 3-56-69-119-104-96" />' +
        '<path id="p24" class="primary medium ears" d="M3329 792c-115 10-162 144-69 233-130 29-81 155-51 199-227-137-269 12-314-126s208-411 434-306" />' +
        '<path id="p25" class="primary dark ears" d="M2849 1067c24-178 256-425 485-297 31 25 18 33-27 31-67-4-227-26-366 239 129-105 280-81 337-11 10 27-108-22-299 87 110-18 248 56 236 119-20 22-116-73-302-62-30 0-76-55-64-106" />' +
        '<path id="p26" class="primary medium ears" d="M2863 1000c-22 56 32 93 60 24 37-92 157-250 341-250-57-39-298-28-401 226" />' +
        '<path id="p27" class="primary medium ears" d="M2925 1047c-33 33-26 84 17 49 42-36 177-108 281-90-80-57-210-45-298 41m21 88c73-22 165-12 237 64-101-24-261-35-237-64" />' +
        '<path id="p28" class="secondary light belly"  />' +
        '<path id="p29" class="secondary dark spikes" d="M1847 245c17-50-200-76-233-27-25 35-10 150 21 172 39 29 201-111 212-145" />' +
        '<path id="p30" class="secondary medium spikes" d="M1748 195c-100-14-129 20-38 35 91 16 112-25 38-35" />' +
        '<path id="p31" class="secondary dark spikes" d="M1640 466c-8-58-247-6-257 57-8 46 57 141 100 153 56 16 162-171 157-210" />' +
        '<path id="p32" class="secondary medium spikes" d="M1529 453c-88 6-160 57-75 49 84-8 205-57 75-49" />' +
        '<path id="p33" class="tertiary dark horns" d="M2383 8c-30 17 77 95 41 208-7 39 144 62 151 22 18-104-111-276-192-230" />' +
        '<path id="p34" class="tertiary light horns" d="M2452 21c77 37 117 144 113 183-3 39-83 50-84 16s-34-145-47-169c-13-25-1-39 18-30" />' +
        '<path id="p35" class="primary dark skin"  />' +
        '<path id="p36" class="primary medium skin"  />' +
        '<path id="p37" class="primary dark skin"  />' +
        '<path id="p38" class="primary light eyes"  />' +
        '<path id="p39" class="neutral light eyes"  />' +
        '<path id="p40" class="neutral medium eyes" d="M1947 841c107-2 239 183 200 341-40 158-220 220-362 119-162-115-174-455 162-460" />' +
        '<path id="p41" class="neutral dark eyes" d="M1929 880c98-2 221 165 185 310-37 145-202 203-332 110-149-106-162-415 147-420" />' +
        '<path id="p42" class="neutral light eyes" d="M2131 1163c66 11 61-67 3-77-124-20-117 57-3 77m-342-33c34-2 47 48 1 56-45 7-34-54-1-56" />' +
        '<path id="p43" class="primary light eyes" d="M2937 772c-79-47-190 220-90 410 35 66 159 24 171-27 17-106-24-350-81-383" />' +
        '<path id="p44" class="neutral light eyes" d="M2941 816c-68-40-165 191-78 355 30 58 138 21 148-22 14-93-21-304-70-333" />' +
        '<path id="p45" class="neutral medium eyes" d="M2874 790c107 12 130 255 116 327-23 119-103 106-128 84-98-99-57-364 12-411" />' +
        '<path id="p46" class="neutral dark eyes" d="M2872 821c117 6 160 350-5 375-67-13-87-381 5-375" />' +
        '<path id="p47" class="neutral light eyes" d="M2930 987c14-22 94-3 80 54-14 60-95-30-80-54m-82-27c31 6 31 56-12 50-32-5-18-56 12-50" />' +
        '<path id="p48" class="primary medium ears" d="M1040 976c128-10 204 128 119 241 148 8 117 154 93 209 222-192 295-37 319-196s-302-410-531-254" />' +
        '<path id="p49" class="primary dark ears" d="M1615 1188c-59-190-357-417-584-235-29 32-14 39 36 28 72-16 242-70 443 195-160-92-320-37-369 49-7 31 113-43 341 40-123 1-260 106-235 173 26 21 113-101 319-123 31-5 72-73 49-127" />' +
        '<path id="p50" class="primary medium ears" d="M1587 1118c35 56-17 106-60 36-58-93-217-244-418-210 55-53 320-85 478 174" />' +
        '<path id="p51" class="primary medium ears" d="M1529 1180c42 30 43 87-10 56s-212-85-322-46c76-77 220-88 332-10m-6 100c-85-11-184 17-247 113 105-44 277-86 247-113" />' +
        '<path id="p52" class="primary light ears" d="M1553 1064c32 42 11 101-42 36-54-64-34-135 42-36" />' +
        '<path id="p53" class="secondary dark spikes" d="M2460 419c32 16 54-122 12-150-25-17-76-11-87 19-12 30 54 120 75 131m-126-162c40 0 13-163-43-171-32-4-83 27-85 63-1 37 102 108 128 108m-208-99c37-27-99-156-157-125-34 18-77 119-43 146 22 17 175-3 200-21" />' +
        '<path id="p54" class="secondary medium spikes" d="M2475 277c19 2 24 122-6 129-29 8-5-130 6-129M2299 88c25-9 81 150 35 169-24 0-48-164-35-169m-311-51c21-18 137 55 141 109-1 3-16 18-31 10-45-26-119-111-110-119" />' +
        '<path id="p55" class="tertiary dark horns" d="M1773 55c-45 6 44 85 28 231-5 56 165 53 159-31-3-43-70-217-187-200" />' +
        '<path id="p56" class="tertiary light horns" d="M1826 69c80 39 122 150 118 191s-87 52-88 16c-1-35-35-150-49-176-14-25-1-40 19-31" />' +
        '<path id="p57" class="primary medium wing" d="M29 2031c116-41 333 127 305 285 182-96 467 34 474 148 90-179 468-266 711-244-310-93-661-538-755-545-95-8-735 356-735 356" />' +
        '<path id="p58" class="primary dark wing" d="M1664 2331c-104 17-80-68-130-88-51-19-451-131-519-184-68-52-123 414-259 438-57 10 195-429 97-489-116-71-517 383-556 331-56-75 552-518 428-579S-14 2107 0 2045c15-61 652-448 813-441s225 334 478 393 419 0 486 98c50 75-2 218-113 236" />' +
        '<path id="p59" class="primary medium wing" d="M1687 2060c55-2 102 72 41 158-62 86-85 2-157-19-73-20-331-105-498-201-109-63-110 254-288 441 62-85 183-412 100-490-84-78-487 342-520 319-34-23 454-389 397-517-58-128-455 106-617 189 190-163 565-351 678-337 114 15 133 140 289 270 267 225 510 190 575 187" />' +
        '<path id="p60" class="primary light wing" d="M830 1600c64 24 136 125 135 166-2 42-114-59-179-69-65-9-181 19-172-10 10-28 156-109 216-87m842 468c49-7 68 28 4 70-65 42-155-48-4-70" />' +
        '<path id="p61" class="primary light wing" d="M619 1861c-54-37-412 152-431 185 69 25 156 121 151 177 100-120 354-310 280-362m-139 411c101-26 229 37 282 101 36-96 104-235 50-272-52-36-273 118-332 171m723-82c-126 6-186-9-207-9-22 0-80 121-88 152 96-82 267-140 295-143" />' +
        '<path id="p62" class="primary light ears" d="M1197 1036c18-39 168 15 194 69-62-19-154 22-176 31 17-43-18-100-18-100m64 209c40-20 117 18 117 18-47 16-90 67-90 67 13-38-27-85-27-85m1957-392c-91 0-142 76-139 101 3 24 43-17 131 10-27-47 8-111 8-111m-48 229c-9 23 0 63 0 63-27-26-84-33-101-33 30-32 87-41 101-30" />' +
        '<path id="p63" class="primary darkest spots" d="M1433 2862c-41-24-105 84-32 124 73 39 105-84 32-124m1306-159c3 2 68 119-30 113-99-7-27-116 30-113m-75 224c40-11 55 61 6 62-48 1-42-53-6-62m-1163-486c80 50 26 195-72 160-72-26-18-216 72-160m146-255c52 27 22 69-19 70s-32-96 19-70m-31 484c58 25 45 146-39 129-50-10-63-171 39-129m-340 3c67-19 108 108 2 135s-53-121-2-135m402 300c44 8 32 51 0 55s-44-63 0-55m-93 95c-45-15-86 55-29 72s87-52 29-72m-337-4c-40-13-77 50-26 65s78-47 26-65m897-136c47-33 99 87 43 130-55 43-126-72-43-130m55-152c33-13 47 67 5 58s-34-46-5-58m54 388c-65-48-134 32-71 81 62 50 142-30 71-81M2104 235c-106 38-62 187 84 164 148-23 84-225-84-164m265 198c82-24 164 109 74 141s-161-115-74-141m232-116c-67-28-93 79-28 105 75 30 69-89 28-105m-19 348c-44-32-80 84-28 83 53 0 67-55 28-83" />',
    male: [
        [6, 'M1255 2683c4-61-249-46-272 16-18 46 28 154 69 173 53 25 200-149 203-189m769-992c8-79-323-69-357 11-24 60 31 202 84 229 68 35 268-187 273-240m-288 313c3-79-324-53-353 29-22 60 58 208 112 232 70 31 238-208 241-261m-226 318c-12-63-262 21-269 90-5 51 70 147 117 155 60 11 161-204 152-245'],
        [7, 'M2002 1707c-18-40-209-30-255 14-45 44 20 210 79 198 58-12 198-166 176-212m-974 1025c22-26 195-35 186 0-9 36-91 148-133 131-42-16-72-107-53-131m667-720c-21-38-206-14-247 31s34 202 90 186c56-15 181-174 157-217m-196 326c-26-26-175 36-199 83-23 48 75 161 118 136 43-26 112-188 81-219'],
        [8, 'M2572 3067c-166 189 205 189 262 133 100-305 34-786-303-844'],
        [9, 'M2763 2594c40-24 107 287 62 580-41 77-155 79-227 53-72-25-47-102 18-125 118-167 108-484 147-508'],
        [11, 'M1613 3142c135 68 347 109 691 17 343-91 475-550 328-1009a898 898 0 01-5-574l-690 23c76 177-366 393-540 913-60 138-493 343-424 795 79 520 1059 589 1360 297 42-32 49-115-96-70-503 91-1010-143-691-399'],
        [12, 'M1845 2450c59 17 110 61 131 12 77-177 114-213 200-211 63 2 173 71 181 159 0 0 181-421 118-610-88-5-273-50-434-87-100 212-521 428-652 896-343 239-424 557-223 847 194 281 824 368 1137 101 17-16 17-36-20-24-30 9-92 26-168 40-157 27-700 24-803-168-168-312 122-437 168-455-7-252 101-576 365-500'],
        [13, 'M1553 3015c-261-6-385 264-242 436 162 195 584 265 926 83-242 39-710-26-756-208-38-147 68-141 68-141m64-8c135 68 347 102 691 10 343-92 503-578 356-1037-19-58-38-128-48-208-13-106-9-229 36-366l-378 56c-48 179 149 677-2 1102-132 369-433 361-582 347'],
        [14, 'M2320 1957c-12-124 262-140 275-30 69 331 211 880-144 1039-101-350-92-629-131-1009'],
        [28, 'M2601 1952c26 37 38 94-64 114s-191-29-165-74c32-56 211-65 229-40m26 136c32 15 67 110-75 134-142 25-199-53-174-84 26-31 227-61 249-50m36 171c-29-9-186 10-224 27-37 17-59 78 29 105 88 26 165 3 206-32 40-36 17-92-11-100m26 183c36 15 35 136-108 145-143 10-176-95-142-128 35-32 227-27 250-17m-11 214c30 28-1 132-140 125-138-7-147-128-104-146s228 5 244 21m-1210 583c-10-43-205-78-182 8 22 86 203 90 182-8m40 130c-31-46-200 10-163 69 50 80 219 14 163-69m116 88c-31-11-158 83-95 121 76 46 173-94 95-121m146 48c-24-6-105 109-45 121 74 15 112-105 45-121m141 26c-23 0-68 88-21 93 58 6 75-93 21-93m127 11c-22 0-53 64-17 68 43 4 57-68 17-68'],
        [35, 'M2238 137c436 34 682 298 719 600 29 231-7 295 72 422 121 196 174 726-762 507-501-16-994-371-852-943 132-441 469-614 823-586'],
        [36, 'M2294 211c-516-106-967 355-800 845 129 259 175 465 506 527 259 49 622 135 810 98 236-47 298-292 189-537-110-245-1-922-705-933'],
        [37, 'M2545 1350c54-38 90 65 58 74-32 10-86-54-58-74m284-61c-66-6-46 101-13 93 32-7 47-90 13-93m-589-17c86-176-111-594-429-440-241 117-163 392-18 479 171 104 389 80 447-39m684-532c-86-51-208 242-99 449 39 73 175 27 188-28 18-117-27-384-89-421'],
        [38, 'M2219 1265c79-163-99-533-393-391-222 108-151 362-17 442 158 96 356 59 410-51'],
        [39, 'M2172 1253c70-143-78-467-336-342-196 94-133 318-15 389 138 84 304 50 351-47']
    ],
    female: [
        [6, 'M1255 2683c4-61-249-46-272 16-18 46 28 154 69 173 53 25 200-149 203-189m769-992c8-79-273-41-307 39-24 60 46 200 99 227 68 35 203-213 208-266m-231 339c3-79-337-72-366 10-22 60 49 212 103 236 70 31 239 2 263-246m-257 305c-12-63-288 8-295 77-5 51 70 147 117 155 60 11 187-191 178-232'],
        [7, 'M2002 1707c-18-40-194-17-240 27-45 44 27 199 86 187 58-12 176-168 154-214m-974 1025c22-26 195-35 186 0-9 36-91 148-133 131-42-16-72-107-53-131m737-683c-21-38-239-44-280 1s45 221 101 205c56-15 203-163 179-206m-238 306c-26-26-203 19-227 66-23 48 75 161 118 136 43-26 140-171 109-202'],
        [8, 'M2572 3067c-166 189 205 189 262 133 34-166 43-295-37-516-83-233-210-319-350-284'],
        [9, 'M2647 2575c110 53 174 299 178 599-41 77-155 79-227 53-72-25-47-102 18-125-44-369-25-361 31-527'],
        [11, 'M1613 3142c135 68 333-98 677-190 512-465 561-921 315-1336-155-284-39 147 22-40l-657 4c-25 302-231 449-573 932-60 138-493 343-424 795 79 520 1059 589 1360 297 42-32 49-115-96-70-503 91-1010-143-691-399'],
        [12, 'M1845 2450c59 17 110 61 131 12 77-177 114-213 200-211 63 2 173 71 181 159 0 0 230-409 167-598-88-5-151 217-450-182-59 307-369 567-685 979-343 239-424 557-223 847 194 281 824 368 1137 101 17-16 17-36-20-24-30 9-92 26-168 40-157 27-700 24-803-168-168-312 122-437 168-455-7-252 101-576 365-500'],
        [13, 'M1553 3015c-261-6-385 264-242 436 162 195 584 265 926 83-242 39-710-26-756-208-38-147 68-141 68-141m64-8c135 68 263-196 677-225 351-406 413-634 436-777 51-318-102-471-145-534-18 87-256 34-433 15 267 354 415 786 120 1078-377 299-433 361-582 347'],
        [14, 'M2416 2155c-40-149-110-295-73-331 129-126 231-93 292-34 185 182 73 695-345 1162-101-350 277-361 126-797'],
        [28, 'M2612 1893c48 71 69 187-33 207s-131-177-105-222c32-56 101-26 138 15m40 375c-2-157-167-170-157 2 9 171 158 112 157-2m-47 174c36 15-49 230-146 239-71 10-22-189 12-222 35-32 111-27 134-17m-1182 816c-10-43-76-68-82 37 17 174 99 119 82-37m140 228c-85-62-205-64-50 44 113 69 159 3 50-44m277 61c-124-3-213 41-28 51 160 6 110-51 28-51'],
        [35, 'M2238 137c498 108 711 333 719 600 29 231-7 295 72 422-116 483-88 568-955 471-349-125-714-475-575-1012 132-441 385-509 739-481'],
        [36, 'M2404 285c-518-154-831 320-853 648 13 598 871 759 1188 664 136-43 165-99 260-453-137-238 68-704-595-859'],
        [37, 'M2545 1350c54-38 90 65 58 74-32 10-86-54-58-74m128-31c-66-6-8 90 25 82 32-7 9-79-25-82m-404-60c46-93 55-341-308-575-33-21 121 150 80 129-102-53-241-91-424-103-31-2 337 83 194 122-241 117-163 392-18 479 171 104 418 67 476-52m655-519c-126 58 3-139-37-98-55 56-59 93-69 156-7 42-34-177-39-91-13 240 4 402 46 482 39 73 175 27 188-28 18-117-27-384-89-421'],
        [38, 'M2249 1268c79-163-129-536-423-394-222 108-151 362-17 442 158 96 386 62 440-48'],
        [39, 'M2207 1257c70-143-113-471-371-346-196 94-133 318-15 389 138 84 339 54 386-43']
    ],
    chromosome: {
        base: '<rect x="15" y="10" rx="5" ry="5" width="105" height="14"/>' +
            '<rect x="15" y="26" rx="5" ry="5" width="120" height="14"/>' +
            '<rect x="15" y="71" rx="5" ry="5" width="120" height="14"/>' +
            '<rect x="15" y="97" rx="5" ry="5" width="120" height="14"/>' +
            '<rect x="15" y="141" rx="5" ry="5" width="120" height="14"/>' +
            '<rect x="15" y="186" rx="5" ry="5" width="120" height="14"/>' +
            '<rect x="15" y="229" rx="5" ry="5" width="105" height="14"/>' +
            '<rect id="gene-xy-button" x="101" y="227" rx="10" ry="10" width="18" height="18" class="sex-chromosome-button"></rect>' +
            '<path id="pa1" class="chromosome"/>' +
            '<path id="pa2" class="chromosome"/>' +
            '<path id="pxy1" class="chromosome"/>' +
            '<path id="pxy2" class="chromosome"/>' +
            '<path id="gene-lh" class="gene-medium dominant horns-type" d="M62 16h14"/>' +
            '<path id="gene-rh" class="gene-medium recessive horns-type" d="M104 16h14"/>' +
            '<path id="gene-ls" class="gene-small dominant spots-type" d="M62 31h14"/>' +
            '<path id="gene-rs" class="gene-small recessive spots-type" d="M104 31h14"/>' +
            '<path id="gene-lw" class="gene-giant dominant wings-type" d="M62 77h14"/>' +
            '<path id="gene-rw" class="gene-giant recessive wings-type" d="M104 77h14"/>' +
            '<path id="gene-lt" class="gene-medium dominant claws-type" d="M62 102h14"/>' +
            '<path id="gene-rt" class="gene-medium recessive claws-type" d="M104 102h14"/>' +
            '<path id="gene-lc" class="gene-small dominant color-type" d="M62 146h14"/>' +
            '<path id="gene-rc" class="gene-small recessive color-type" d="M104 146h14"/>' +
            '<path id="gene-lp" class="gene-large dominant spikes-type" d="M62 192h14"/>' +
            '<path id="gene-rp" class="gene-large recessive spikes-type" d="M104 192h14"/>' +
            '<text id="gene-label-h" class="genotype-label horns-type" text-anchor="middle" x="90" y="21">Hh</text>' +
            '<text id="gene-label-s" class="genotype-label spots-type" text-anchor="middle" x="90" y="37">Ss</text>' +
            '<text id="gene-label-w" class="genotype-label wings-type" text-anchor="middle" x="90" y="82">Ww</text>' +
            '<text id="gene-label-t" class="genotype-label claws-type" text-anchor="middle" x="90" y="108">Tt</text>' +
            '<text id="gene-label-c" class="genotype-label color-type" text-anchor="middle" x="90" y="152">Cc</text>' +
            '<text id="gene-label-p" class="genotype-label spikes-type" text-anchor="middle" x="90" y="197">Pp</text>' +
            '<text id="gene-label-xy1" class="genotype-label sex-type-1" text-anchor="middle" x="70" y="240">X</text>' +
            '<text id="gene-label-xy2" class="genotype-label sex-type-2" text-anchor="middle" x="110" y="240">Y</text>' +
            '<text class="phenotype-label horns-type" text-anchor="end" x="55" y="21">horns</text>' +
            '<text class="phenotype-label spots-type" text-anchor="end" x="55" y="37">spots</text>' +
            '<text class="phenotype-label wings-type" text-anchor="end" x="55" y="82">wings</text>' +
            '<text class="phenotype-label claws-type" text-anchor="end" x="55" y="108">claws</text>' +
            '<text class="phenotype-label color-type" text-anchor="end" x="55" y="152">color</text>' +
            '<text class="phenotype-label spikes-type" text-anchor="end" x="55" y="197">spikes</text>' +
            '<text class="phenotype-label sex-type-2" text-anchor="end" x="55" y="240">sex</text>',
        chromatids: {
            a1: 'M61  39V9s0-8 8-8 8 8 8 8v30c0 7-5 4-5 11s5 4 5 10v52s0 8-8 8-8-8-8-8v-51c0-7 5-4 5-11s-5-4-5-11z',
            a2: 'M103 39V9s0-8 8-8 8 8 8 8v30c0 7-5 4-5 11s5 4 5 10v52s0 8-8 8-8-8-8-8v-51c0-7 5-4 5-11s-5-4-5-11z',
            xy1: 'M61  156v-18s0-8 8-8 8 8 8 8v18c0 6-5 4-5 10s5 4 5 11v38s0 8-8 8-8-8-8-8v-38c0-7 5-4 5-11s-5-4-5-11z',
            xy2: 'M103 156v-18s0-8 8-8 8 8 8 8v18c0 6-5 4-5 10s5 4 5 11v25s0 8-8 8-8-8-8-8v-25c0-7 5-4 5-11s-5-4-5-11z'
        }
    }
}