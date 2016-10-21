import React, { Component } from 'react';

export default class AnnotationTools extends Component {
  render() {
    return (
      <section className="reader-window scheme-light">
        {/*
          Annotation popup is placed absolutely with Javascript based on the location
          of an .annotation-selection (which there can be only one)
        */}
        <div className="annotation-popup" style={{ top: '1523px', left: '430px' }}>
          <button>
            Annotate
          </button>
          <button>
            Highlight
          </button>
          <button>
            Share
          </button>
          <div className="tail"></div>
        </div>
        <div className="container-focus" style={{ maxWidth: '680px' }}>
          <div
            className="manifold-text-section text-section font-sans-serif"
            style={{ fontSize: '22px' }}
          >
            <h1 className="cn">
              <a className="xref" href="/read/47/section/770#toc">
                <span>Chapter One</span>
              </a>
            </h1>
            <h1 className="ct">
              Westward from Vinland
            </h1>
            <h1 className="cs">
              An Immigrant Saga by Hjalmar Holand
            </h1>

            <div className="epigraph">
              <p className="eps">
                Swedes and Norwegians are of the purest Nordic stock and a relatively smaller
                number would have been sufficient to transmit the physical peculiarities for which
                the Mandans were noted than if any other nationality had been represented by these
                early culture bearers.
              </p>
              <p className="ept">
                <span>—Hjalmar Holand, </span><i><span>Westward from Vinland</span></i></p>
            </div>

            <p className="pf">
              <span>
                {/*
                  Annotations from either the current user or another user have separate span
                  tags, and another nested tag to indicate multiple annotations on the same
                  text.
                */}
                The events surrounding the unearthing of the Kensington Rune Stone and its
                immediate aftermath are contradictory and hotly debated. As the story is
                traditionally told by area residents, a Swedish immigrant farmer named Olof Ohman
                was hard at work during the late summer of 1898
                <span className="annotation-underline primary"> cutting down trees on his farm near
                  the town of <span className="multiple">Kensington</span>, Minnesota</span>
                . Ohman and his sons were using a winch to
                pull tree stumps out of the ground in order to prepare a new field for
                cultivation. Tangled in the roots of one tree was a large, gray slab of stone,
                <span className="annotation-underline secondary">
                  which they <span className="multiple">struggled to</span> pull out of the ground
                </span>.
              </span>
              <a className="enref" href="/read/47/section/780#en48">
                <span>1</span>
              </a>
              <span>
                {/*
                  When two annotations meet, the primary annotation (current user) takes presidence
                 */}
                Ohman’s ten-year-old son Edward noticed strange chiseled markings on two sides of
                the stone after he had brushed <span className="annotation-underline secondary">off
                some of the dirt with his cap. Ohman called his neighbor, </span>
                <span className="annotation-underline primary">Nils Flaaten, a Norwegian-American
                  farmer who was working nearby, to come and view the curiosity . In signed
                  affidavits from 1909,
                  Flaaten and Ohman testified that the inscription had an ancient and weathered
                  appearance</span>.
              </span>
              <a className="enref" href="/read/47/section/780#en49">
                <span>2</span>
              </a>
              <span>
                They carried the stone back to Ohman’s farmyard, thinking it might be of
                historical importance. Some of Ohman’s neighbors suspected that the stone might be
                a marker for buried treasure and a swarm of locals descended upon Ohman’s farm
                with shovels in hand.
              </span>
              <a className="enref" href="/read/47/section/780#en50">
                <span>3</span>
              </a>
            </p>

            <p >
              <a id="p16" className="page" ></a>
              <span >
                Although no treasure was found, numerous
                <span className="annotation-highlight primary"> area residents
                <span className="multiple">viewed the stone</span> with curiosity after Ohman</span>
                permitted its display in the window of the First State Bank in the nearby village of
                Kensington.
              </span>
              <a id="en51r" className="enref" href="/read/47/section/780#en51" >
                <span >4</span>
              </a>
              <span> <span className="annotation-highlight secondary">Local residents,
                <span className="multiple">primarily of Norwegian and Swedish</span> descent</span>,
                concluded that the symbols were similar to those found in illustrations of runic
                inscriptions in Scandinavian history books. Bank cashier and Norwegian immigrant
                Samuel A. Siverts made a copy of the inscription and sent it to Professor Olaus
                Breda, a Scandinavian linguist at the University of Minnesota, in January 1899.
                A month later, the stone was shipped to Professor George Curme, a linguist at
                Northwestern University in Chicago.
              </span>
            </p>

            <p >
              <span >
                In February 1899, <span className="annotation-highlight primary">a local newspaper
                reported that Professor Breda concluded that there were “internal evidences in the
                  inscription that it is not authentic.”</span>
                <span className="annotation-highlight secondary"> The chief of these, he says, is
                that “the inscriptions seem to be a jumble</span> of Swedish
                and Norwegian in late grammatical forms and here and there English words, but all
                spelled in runic characters. They are not old Norse.”
              </span>
              <a id="en52r" className="enref" href="/read/47/section/780#en52" >
                <span >5</span>
              </a>
              {/*
                In REACT, every text element will have spans around it, and so spans for
                highlighting text may need to be duplicated inside multiple spans to create the
                correct appearance.

                Alternatively, we could use Javascript to highlight the entire block behind
                selected text.
              */}
              <span >
                Professor Curme was also skeptical of the runic inscription for similar linguistic
                reasons. Additionally, copies of the inscription were analyzed by scholars in
                Oslo, Norway. The conclusions of Christiana University professors Gustav Storm,
                Sophus Bugge, and <span className="annotation-selection">Oluf Rugh were published
                in the</span>
              </span>
              <i >
                <span ><span className="annotation-selection">Minneapolis Tribune</span></span></i>
              <span >
                <span className="annotation-selection">in April 1899: “The so-called rune stone is a
                crude fraud, perpetrated by a Swede with the aid</span> of a chisel and a meager
                knowledge of runic letters and English.”
              </span>
              <a id="en53r" className="enref" href="/read/47/section/780#en53" >
                <span >6</span></a>
              <span >
                Following the initial scientific assessments and the negative publicity that
                followed, public opinion of the stone as an authentic medieval artifact quickly
                faded. To the disappointment of many,
              </span>
            </p>
              {/*
                Including an annotation block will likely require that all non-block level
                parent elements of interrupted elements are closed and reopened after the
                annotation.

                If this is not possible, it will need to be absolutely positioned regularly by
                Javascript, and also leave behind a block level element that creates spacing
              */}
              <div className="annotation-form" style={{ width: 'calc(100vw - (100vw - 650px)/2)' }}>
                <header>
                  <span className="title" style={{ left: 'calc((650px - 100vw)/2)' }}>
                    <i className="manicon manicon-pencil"></i>
                    {'Add Annotation'}
                  </span>
                  <button className="button-close">
                    <i className="manicon manicon manicon-x"></i>
                    <span className="screen-reader-text">
                      {'Click to close annotation form'}
                    </span>
                  </button>
                </header>
                {/*
                  The form container should be passed the same max width as the text section
                  from the margin UI controls
                */}
                <div className="form-container" style={{ maxWidth: '650px' }}>
                  <form>
                    <div className="form-input">
                      <textarea></textarea>
                      <button className="button-add">
                        <i className="manicon manicon-plus"></i>
                        Add Attachment
                      </button>
                    </div>

                    <div className="form-controls">
                      <label className="checkbox">
                        <input type="checkbox"/>
                        <span className="toggle-indicator">
                          <i className="manicon manicon-check"></i>
                        </span>
                        {'This annotation is private'}
                      </label>
                      <button className="button-cancel">
                        Cancel
                      </button>
                      <button className="button-submit">
                        <i className="manicon manicon-word-bubble-lines"></i>
                        Publish
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            <p>
              <span>
                it was returned to Ohman’s farm, where it
                sat in obscurity for more than eight years. As one enthusiast described it, the
                rune stone served as a stepping stone for Ohman’s granary and provided “a
                tolerable place to straighten nails and rivet harness straps.”
              </span>
              <a id="en54r" className="enref" href="/read/47/section/780#en54" >
                <span >7</span>
              </a>
            </p>

            <div className="section">
              <h2 id="ah0101" className="ah">
                <span >Leif Eriksson and the “True” Discovery of America</span>
              </h2>
              <p className="paft">
                <span>
                  To most observers, it was no coincidence that a rune stone purporting to be
                  from the fourteenth century was unearthed in the field of a Swedish-American
                  farmer in a region heavily populated by recent immigrants from Sweden and
                  Norway. During the late nineteenth and early twentieth century, these immigrants
                  were prolific producers and consumers of historical literature about Viking
                  travels in North America prior to the </span>
                <a id="p17" className="page" ></a><a id="p18" className="page" ></a>
                <span >
                  arrival of Christopher Columbus in the West Indies in 1492. The early
                  presence of Vikings in North America demonstrated that Swedes and Norwegians
                  belonged here. Writing in 1900, the Norwegian-American poet Franklin Petersen
                  said, “Because we are reminded of the sagas of old and are proud of the land we
                  forsook. Can it be that the blood of the Vikings still flows in our veins like a
                  still-running brook?”
                </span>
                <a id="en55r" className="enref" href="/read/47/section/780#en55" >
                  <span >8</span>
                </a>
                <span>
                  Historian Odd Lovoll uses the moniker “Cult of Leif Eriksson” to describe the
                  widespread enthusiasm for all things Viking.
                </span>
              </p>
              <div className="figure" >
                <p className="fig">
                  <img
                    src="/system/resources/attachments/000/001/364/original/ump-krueger-fig01.jpg"
                    alt="" style={{ maxWidth: '413px' }}
                  ></img>
                </p>
                <p className="figcap" >
                  <span >
                    The Kensington Rune Stone is thirty-six inches long, fifteen inches wide, about
                    six inches thick, and weighs just over two hundred pounds. Courtesy of the
                    Douglas County Historical Society, Minnesota.
                  </span>
                </p>
              </div>
              <p >
                <span >
                  Rasmus B. Anderson (1846–1936) was the first widely known writer to promote the
                  myth of Viking discovery in his book
                </span>
                <i ><span >America Not Discovered by Columbus</span></i>
                <span >published in 1874.</span>
                <a id="en56r" className="enref" href="/read/47/section/780#en56" >
                  <span >9</span>
                </a>
                <span >
                  In this book, Anderson attempted to educate both Norwegian immigrants and other
                  Americans about Norwegian literature and mythology, while challenging America’s
                  foundation myths by demonstrating that Scandinavians played a vital role in the
                  origins of the United States.
                </span>
                <a id="en57r" className="enref" href="/read/47/section/780#en57" >
                  <span >10</span>
                </a>
                <span >
                  According to historian Orm Øverland, immigrant writers have often used
                  “homemaking myths” to convince both fellow immigrants and the dominant society
                  that they belong in America. Immigrants use “foundation myths” to claim that their
                  ancestors were the first or among the first Europeans to explore and settle in
                  North America. “Blood sacrifice myths” are used to demonstrate that an immigrant
                  group has made sacrifices for the host nation in some way, especially in times of
                  national crisis. Ideological homemaking myths describe how a particular ethnic
                  group had already embodied certain central components of American ideals before
                  arriving in the United States. All three of these myths can be found in the
                  writings of Rasmus B. Anderson.
                </span>
                <a id="en58r" className="enref" href="/read/47/section/780#en58" >
                  <span >11</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
