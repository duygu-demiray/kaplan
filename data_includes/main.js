// Remove command prefix
PennController.ResetPrefix(null);

// Control trial sequence
Sequence("counter",
         "consent",
         "intro", 
         "practice",
         "practice-end",
         shuffle(randomize("experimental-trial"), randomize("fillers")), 
         "debriefing",
         "send", 
         "completion_screen");

// Increment the counter for list balancing
SetCounter("counter", "inc", 1);

// Consent form
newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("please check the consent box before starting the experiment")
        .center()
        .print()
    ,
    newButton("continue", "click here to continue")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  .failure(getHtml("consent_form").warn())
        )
);

// Instructions
newTrial("intro",
    newHtml("intro1", "intro1.html")
        .cssContainer({"width":"720px"})
        .radioWarning("please answer the questions before continuing")
        .center()
        .print()
        .log()
    ,
    newButton("continue", "continue")
        .center()
        .print()
        .wait(getHtml("intro1").test.complete()
            .failure(getHtml("intro1").warn())
            )
    ,
    clear()
    ,
    newHtml("intro2", "intro2.html")
        .cssContainer({"width":"720px"})
        .radioWarning("please answer the questions before continuing")
        .center()
        .print()
        .log()
    ,
    newButton("continue", "continue")
        .center()
        .print()
        .wait(getHtml("intro2").test.complete()
            .failure(getHtml("intro2").warn())
            )
    ,
    clear()
    ,
    newHtml("intro3", "intro3.html")
        .cssContainer({"width":"720px"})
        .radioWarning("please answer the questions before continuing")
        .center()
        .print()
        .log()
    ,
    newButton("continue", "continue")
        .center()
        .print()
        .wait(getHtml("intro3").test.complete()
            .failure(getHtml("intro3").warn())
            )
);


// Practice trial
Template("kaplan_practice.csv", row =>
    newTrial("practice"
    ,
        newText("break", "+")
            .center()
            .cssContainer({"font-size": "50px", "line-height": "150%"}) 
            .print()
        ,
        newKey("keypress", " ")
            .wait()
        ,
        clear()
        ,
        newController("DashedSentence", {s: row.sentence, 
                                        mode: 'speeded acceptability',
                                        display: 'in place',
                                        wordTime: 250,
                                        wordPauseTime: 150})
            .center()
            .print()
            .wait()
            .remove()
            .log()
        ,
        newController("Question", {q: row.question, 
                                    as: [["E", row.ans1], ["I", row.ans3], 
                                        ["F", row.ans2], ["J", row.ans4]],
                                    presentHorizontally: true,
                                    randomOrder: false})
            .cssContainer({"width":"720px"})
            .center()
            .print()
            .log()
        ,
        newTimer("time limit", 5000)
            .log()
            .start()
        ,
        newKey("answer_practice", "EFJI")
            .log("first")
            .callback(getTimer("time limit").stop() )
        ,
        getTimer("time limit")
            .wait()
        ,
        getKey("answer_practice")
            .test.pressed()
                .failure(newText("negative feedback", "Too slow!")
                    .log()
                    .print()
                .   settings.center()
                    .cssContainer({"font-size": "160%", "color": "red"})
                )
        ,
        getController("Question")
            .remove()
        ,
        newTimer("afterSentence", 1000)
            .start()
            .wait()
         
)
    .log("group", row.group)
    .log("item", row.item)
    .log("sentence", row.sentence)
    .log("question", row.question)
    .log("condition", row.condition)
    .log("attraction_type", row.attraction_type)
    .log("position", row.position)
    .log("agreement", row.agreement)
    .log("target-ver", row.target_ver)
    .log("target-nonver", row.target_nonver)
    .log("distractor-ver", row.distractor_ver)
    .log("distractor-nonver", row.distractor_nonver)
    .log("ans1", row.ans1)
    .log("ans2", row.ans2)
    .log("ans3", row.ans3)
    .log("ans4", row.ans4)
);


// End of practice screen
newTrial("practice-end"
    ,
    newText("practice-end", "That's all for practice. Now the main part of the experiment will begin")    
        .center()
        .print()
    ,
    newButton("continue", "continue")
        .center()
        .print()
        .wait()
);

// Experimental trial
Template("kaplan_items.csv", row =>
    newTrial("experimental-trial"
    ,
        newText("break", "+")
            .center()
            .cssContainer({"font-size": "50px", "line-height": "150%"}) 
            .print()
        ,
        newKey("keypress", " ")
            .wait()
        ,
        clear()
        ,                
        newController("DashedSentence", {s: row.sentence, 
                                        mode: 'speeded acceptability',
                                        display: 'in place',
                                        wordTime: 250,
                                        wordPauseTime: 150})
            .center()
            .print()
            .wait()
            .remove()
            .log()
        ,
        newController("Question", {q: row.question, 
                                    as: [["E", row.ans1], ["I", row.ans3], 
                                        ["F", row.ans2], ["J", row.ans4]],                                    
                                    presentHorizontally: true,
                                    randomOrder: false})
            .cssContainer({"width":"720px"})
            .center()
            .print()
        ,
        newTimer("time limit", 5000)
            .log()
            .start()
        ,
        newKey("answer", "EFJI")
            .log("first")
            .callback( getTimer("time limit").stop() )
        ,
        getTimer("time limit")
            .wait()
        ,
        getKey("answer")
            .test.pressed()
                .failure(newText("negative feedback", "Too slow!")
                    .log()
                    .print()
                .   settings.center()
                    .cssContainer({"font-size": "160%", "color": "red"})
                )
        ,
        getController("Question")
            .remove()
        ,
        newTimer("afterSentence", 1000)
            .start()
            .wait()
)
    .log("group", row.group)
    .log("item", row.item)
    .log("sentence", row.sentence)
    .log("question", row.question)
    .log("condition", row.condition)
    .log("cue", row.cue)
    .log("agreement", row.agreement)
    .log("target-ver", row.target_ver)
    .log("target-nonver", row.target_nonver)
    .log("distractor-ver", row.distractor_ver)
    .log("distractor-nonver", row.distractor_nonver)
    .log("ans1", row.ans1)
    .log("ans2", row.ans2)
    .log("ans3", row.ans3)
    .log("ans4", row.ans4)
);

// Filler trial
Template("kaplan_fillers.csv", row =>
    newTrial("fillers"
    ,
        newText("break", "+")
            .center()
            .cssContainer({"font-size": "50px", "line-height": "150%"}) 
            .print()
        ,
        newKey("keypress", " ")
            .wait()
        , 
        clear()
        ,
        newController("DashedSentence", {s: row.sentence, 
                                        mode: 'speeded acceptability',
                                        display: 'in place',
                                        wordTime: 250,
                                        wordPauseTime: 150})
            .center()
            .print()
            .wait()
            .remove()
            .log()
        ,
        newController("Question", {q: row.question, 
                                    as: [["E", row.ans1], ["I", row.ans3], 
                                        ["F", row.ans2], ["J", row.ans4]], 
                                    presentHorizontally: true,
                                    randomOrder: false})
            .cssContainer({"width":"720px"})
            .center()
            .print()
        ,
        newTimer("time limit", 5000)
            .log()
            .start()
        ,
        newKey("answer", "EFJI")
            .log("first")
            .callback( getTimer("time limit").stop() )
        ,
        getTimer("time limit")
            .wait()
        ,
        getKey("answer")
            .test.pressed()
                .failure(newText("negative feedback", "Too slow!")
                    .log()
                    .print()
                .   settings.center()
                    .cssContainer({"font-size": "160%", "color": "red"})
                )
        ,
        getController("Question")
            .remove()
        ,
        newTimer("afterSentence", 1000)
            .start()
            .wait()
        
)
    .log("group", row.group)
    .log("item", row.item)
    .log("sentence", row.sentence)
    .log("question", row.question)
    .log("condition", row.condition)
    .log("cue", row.cue)
    .log("agreement", row.agreement)
    .log("target-ver", row.target_ver)
    .log("target-nonver", row.target_nonver)
    .log("distractor-ver", row.distractor_ver)
    .log("distractor-nonver", row.distractor_nonver)
    .log("ans1", row.ans1)
    .log("ans2", row.ans2)
    .log("ans3", row.ans3)
    .log("ans4", row.ans4)
);

// Send results manually
SendResults("send");

//debriefing
newTrial("debriefing",
    newHtml("debriefing_form", "debrief.html")
        .cssContainer({"width":"720px"})
        .center()
        .print()
        .log()
    ,
    newButton("continue", "continue")
        .center()
        .print()
        .wait(getHtml("debriefing_form").test.complete()
                  .failure(getHtml("debriefing_form").warn())
        )
);

// Completion screen
newTrial("completion_screen",
    newText("thanks", "Thank you for your participation. Your completion code is C2SERWBN. To complete this experiment, go to: https://app.prolific.co/submissions/complete?cc=C2SERWBN")
        .center()
        .print()
,
    newButton("submit", "sumbit your results")
        .center()
        .print()
        .wait()
);
