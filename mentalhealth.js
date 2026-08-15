// ============================================
// MINDHAVEN - Mental Health Learning Hub
// ============================================

// Mental Health Content Database
const mentalHealthContent = {
    anxiety: {
        title: 'Understanding Anxiety',
        icon: '😰',
        color: '#8FAACF',
        description: 'Anxiety is your body\'s natural response to stress. It\'s a feeling of fear or apprehension about what\'s to come.',
        topics: [
            {
                title: 'What is Anxiety?',
                content: 'Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder. Anxiety disorders form a category of mental health diagnoses that lead to excessive nervousness, fear, apprehension, and worry. Common types include generalized anxiety disorder (GAD), social anxiety disorder, panic disorder, and specific phobias. Anxiety affects approximately 18% of adults each year, making it the most common mental health condition.',
                eli10: 'Anxiety is like having a worry alarm in your brain that goes off too often. It makes you feel scared or nervous even when you\'re safe. Everyone feels anxious sometimes, but some people feel it a lot more than others. It\'s really common - about 1 in 5 adults experience anxiety.'
            },
            {
                title: 'Physical Symptoms',
                content: 'Anxiety can manifest physically in many ways: rapid heartbeat, sweating, trembling, shortness of breath, chest tightness, nausea, dizziness, muscle tension, headaches, fatigue, and sleep disturbances. These symptoms are your body\'s "fight or flight" response activating. Understanding that these are physical reactions to anxiety can help reduce fear of the symptoms themselves.',
                eli10: 'When you\'re anxious, your body might react in ways like your heart beating fast, sweating, shaking, or feeling sick to your stomach. This is your body trying to protect you, even though there\'s no real danger. It\'s uncomfortable but not dangerous.'
            },
            {
                title: 'Panic Attacks',
                content: 'A panic attack is a sudden episode of intense fear that triggers severe physical reactions when there is no real danger or apparent cause. Panic attacks can be very frightening. When they occur, you might think you\'re losing control, having a heart attack, or even dying. They typically peak within 10 minutes and subside within 30 minutes. Remember: panic attacks, while terrifying, are not life-threatening and will pass.',
                eli10: 'A panic attack is when your body suddenly acts like there\'s a big danger, even though you\'re actually safe. Your heart beats fast, you might shake, and it feels really scary. But it will pass, and you\'re not in danger. These feelings usually last about 10 minutes at their worst.'
            },
            {
                title: 'Social Anxiety',
                content: 'Social anxiety disorder involves intense fear of social situations where you might be judged, embarrassed, or rejected. This can include public speaking, meeting new people, or even everyday interactions. People with social anxiety often worry about embarrassing themselves or being judged negatively. It\'s more than just shyness - it can significantly impact daily life.',
                eli10: 'Social anxiety is when you\'re really scared of being around people because you worry they might judge you or think you\'re weird. It makes social situations feel scary instead of fun. It\'s not just being shy - it\'s a strong fear that can make it hard to do everyday things.'
            },
            {
                title: 'Overthinking',
                content: 'Overthinking is when you dwell on the same thoughts repeatedly, analyzing them to the point where it becomes unproductive. It can create a cycle of worry and anxiety that makes it difficult to make decisions or take action. Common patterns include catastrophizing (expecting the worst), mind reading (assuming others\' negative thoughts), and fortune telling (predicting negative outcomes). Breaking these patterns takes practice and patience.',
                eli10: 'Overthinking is like having a song stuck in your head, but instead of a song, it\'s worries. Your brain keeps playing the same thoughts over and over, making it hard to think about anything else. You might always expect the worst thing to happen, even when it probably won\'t.'
            },
            {
                title: 'Health Anxiety',
                content: 'Health anxiety involves excessive worry about having or developing a serious illness. People with health anxiety may misinterpret normal bodily sensations as signs of disease, frequently check their body for symptoms, and seek constant reassurance from doctors or online. This can create a cycle of anxiety that actually worsens physical symptoms through stress.',
                eli10: 'Health anxiety is when you worry a lot about being sick or getting a serious disease. You might think normal feelings in your body mean something is wrong. You might check your body a lot or ask doctors lots of questions. This worry can actually make you feel worse because stress affects your body.'
            },
            {
                title: 'Coping Strategies',
                content: 'Effective coping strategies for anxiety include deep breathing exercises (4-7-8 breathing, box breathing), progressive muscle relaxation, mindfulness meditation, regular physical activity, getting adequate sleep (7-9 hours), limiting caffeine and alcohol, challenging anxious thoughts with evidence, and talking to a mental health professional. Building a "worry time" - setting aside 15-20 minutes daily to process worries - can also help contain anxious thinking.',
                eli10: 'To help with anxiety, you can try breathing slowly, relaxing your muscles one by one, exercising, getting good sleep, and talking to someone you trust. Small steps can make a big difference. You can also try setting aside a specific time each day to think about your worries, so they don\'t take over your whole day.'
            },
            {
                title: 'When to Seek Help',
                content: 'Consider seeking professional help if anxiety interferes with your daily life, relationships, work, or school; if you avoid situations due to anxiety; if you experience physical symptoms frequently; or if you use substances to cope. Therapy (especially CBT), medication, or a combination can be very effective. There\'s no shame in seeking help - anxiety is treatable and you don\'t have to face it alone.',
                eli10: 'It\'s a good idea to talk to a professional if anxiety stops you from doing things you need or want to do, if it\'s hurting your relationships or school/work, or if you feel like you need medicine or other things to cope. Therapy and medicine can really help. Getting help is brave, not weak.'
            }
        ],
        tools: ['breathing', 'grounding', 'panic-relief']
    },
    depression: {
        title: 'Understanding Depression',
        icon: '🌧️',
        color: '#7CB8A6',
        description: 'Depression is more than just sadness. It\'s a persistent feeling of emptiness, hopelessness, and loss of interest in activities you once enjoyed.',
        topics: [
            {
                title: 'What is Depression?',
                content: 'Depression is a common but serious mood disorder. It causes severe symptoms that affect how you feel, think, and handle daily activities, such as sleeping, eating, or working. Depression is not a sign of weakness or something you can "snap out of." Major depressive disorder affects about 7% of adults in any given year. Types include major depression, persistent depressive disorder (dysthymia), bipolar disorder, and seasonal affective disorder (SAD). Depression is treatable through therapy, medication, lifestyle changes, or a combination.',
                eli10: 'Depression is like having a heavy gray cloud that follows you around. It makes everything feel harder and less enjoyable. It\'s not your fault, and you can\'t just decide to feel better. But there are things that can help. Many people experience depression - you\'re not alone.'
            },
            {
                title: 'Common Symptoms',
                content: 'Depression symptoms include persistent sad or empty mood, loss of interest in activities, changes in appetite or weight, sleep disturbances (too much or too little), fatigue or low energy, feelings of worthlessness or guilt, difficulty concentrating, and thoughts of death or suicide. Physical symptoms like aches, pains, headaches, or digestive problems may also occur. Symptoms must last at least two weeks for a diagnosis, but many people experience symptoms for much longer.',
                eli10: 'When you\'re depressed, you might feel sad all the time, not want to do things you used to enjoy, have trouble sleeping or sleep too much, feel tired all the time, feel worthless, have trouble focusing, or even think about death. Your body might hurt too. These feelings can last for weeks or longer.'
            },
            {
                title: 'Low Motivation',
                content: 'Depression can significantly reduce motivation and energy levels. Tasks that once seemed easy may feel overwhelming. This is due to changes in brain chemistry and function, not a personal failing. Executive dysfunction - difficulty planning, initiating, and completing tasks - is common. The "depression fatigue" is real and can be debilitating. Breaking tasks into tiny steps and celebrating small accomplishments can help.',
                eli10: 'When you\'re depressed, even simple things like getting out of bed can feel really hard. It\'s like your battery is always low. This is part of depression, not because you\'re lazy. Your brain is working differently right now. Breaking big tasks into tiny pieces can help.'
            },
            {
                title: 'Numbness',
                content: 'Emotional numbness is a common experience in depression. It can feel like being disconnected from your emotions or unable to feel pleasure in things you normally would enjoy (anhedonia). This numbness is a protective mechanism - your brain may be shutting down emotional responses to cope with overwhelming feelings. It can feel frightening but is temporary. Sensory experiences, gentle movement, and connection with others can help gradually restore emotional responsiveness.',
                eli10: 'Sometimes depression doesn\'t make you sad - it makes you feel nothing at all. Like you\'re wrapped in thick blankets and can\'t really feel anything. Things that used to make you happy don\'t anymore. This is your brain trying to protect itself. This feeling can pass with time and help.'
            },
            {
                title: 'Sleep Changes',
                content: 'Sleep disturbances are very common in depression. This can include insomnia (difficulty falling or staying asleep), hypersomnia (excessive sleeping), or poor sleep quality. Depression affects the brain\'s sleep regulation systems. Poor sleep can worsen depression symptoms, creating a difficult cycle. Establishing a consistent sleep schedule, limiting screens before bed, and creating a calming bedtime routine can help. Sleep problems often improve as depression is treated.',
                eli10: 'Depression can really mess with your sleep. You might have trouble falling asleep, wake up a lot during the night, or sleep way too much. Your brain isn\'t regulating sleep normally right now. Bad sleep makes depression worse, and depression makes sleep worse - it\'s a tough cycle. Having a regular bedtime and avoiding screens before bed can help.'
            },
            {
                title: 'Guilt and Shame',
                content: 'Many people with depression experience intense guilt and shame. You might feel guilty about not being "productive," about needing help, or about "burdening" others. These feelings are symptoms of depression, not reflections of reality. Depression can distort your thinking, making you believe things that aren\'t true. You deserve care and support. Depression is an illness, not a character flaw.',
                eli10: 'When you\'re depressed, you might feel guilty a lot - like you\'re not doing enough, or you\'re being a burden to others. These feelings come from depression, not from who you really are. Depression can trick your brain into thinking things that aren\'t true. You deserve help and you\'re not a burden.'
            },
            {
                title: 'Gentle Recovery',
                content: 'Recovery from depression is often gradual - think months, not days. Focus on small, manageable steps: basic self-care (eating, sleeping, hygiene), one small activity per day, connecting with one safe person, or just getting through the day. Be patient with yourself - healing is not linear. Consider seeking professional help (therapy, medication, or both), building a support network, and engaging in activities you used to enjoy, even if you do not feel like it at first. "Action before motivation" - sometimes doing comes before feeling like doing.',
                eli10: 'Getting better from depression happens slowly, like a plant growing. Take tiny steps - maybe just getting out of bed, eating something, or texting a friend. Be kind to yourself. Some days will be harder than others, and that is okay. Asking for help is brave and smart. Sometimes you have to do things even when you do not feel like it.'
            },
            {
                title: 'When to Seek Help',
                content: 'Seek professional help if you\'ve been feeling depressed for more than two weeks, if symptoms interfere with daily life, if you\'re having thoughts of self-harm or suicide, or if you\'re using substances to cope. Depression is treatable - therapy (especially CBT and interpersonal therapy), medication (antidepressants), or a combination are effective for most people. There\'s no shame in seeking help - depression is a medical condition that responds to treatment.',
                eli10: 'It\'s important to talk to a professional if you\'ve been feeling depressed for more than two weeks, if it\'s stopping you from doing normal things, if you\'re thinking about hurting yourself, or if you\'re using drugs or alcohol to cope. Depression can be treated with therapy, medicine, or both. Getting help is brave - depression is like any other illness that needs treatment.'
            }
        ],
        tools: ['low-energy', 'journal']
    },
    loneliness: {
        title: 'Understanding Loneliness',
        icon: '🫂',
        color: '#B8A7D1',
        description: 'Loneliness is the feeling of being isolated or disconnected from others, even when surrounded by people. It\'s a universal human experience.',
        topics: [
            {
                title: 'What is Loneliness?',
                content: 'Loneliness is the state of feeling alone or disconnected from others, regardless of the actual amount of social contact. It is a subjective experience that can affect anyone, regardless of their social situation. You can feel lonely in a crowd or content when alone. Loneliness is different from solitude - solitude is the state of being alone and can be peaceful, while loneliness is the distressing feeling of isolation. Chronic loneliness can affect both mental and physical health, increasing risks of depression, anxiety, heart disease, and weakened immune function.',
                eli10: 'Loneliness is when you feel alone inside, even if there are people around you. It is like being in a room full of people but feeling like no one really knows you. Everyone feels this way sometimes. Being alone is not the same as feeling lonely - you can be happy alone, but loneliness feels sad and disconnected.'
            },
            {
                title: 'Types of Loneliness',
                content: 'Loneliness can take different forms: emotional loneliness (lack of close relationships), social loneliness (lack of broader social network), situational loneliness (caused by life changes like moving or breakup), and chronic loneliness (persistent over long periods). Understanding which type you are experiencing can help identify appropriate solutions. Transient loneliness is normal and temporary, while chronic loneliness may require more intentional effort to address.',
                eli10: 'There are different kinds of loneliness. You might feel lonely because you do not have close friends, or because you do not have many people in your life at all. Sometimes loneliness happens because of big changes like moving or a breakup. Short-term loneliness is normal, but if it lasts a long time, you might need to work on it more intentionally.'
            },
            {
                title: 'Social Anxiety',
                content: 'Social anxiety is the fear of social situations that involve interaction with other people. It can cause intense worry about being judged, embarrassed, or rejected by others. This can make it difficult to reach out or maintain connections, creating a cycle of loneliness and anxiety. Social anxiety is treatable through therapy (especially CBT), gradual exposure to social situations, and sometimes medication. Remember: many people feel this way, and it does not mean you are unlikable.',
                eli10: 'Social anxiety is when you are really scared of being around people because you worry they might judge you or think you are weird. It makes social situations feel scary instead of fun. This can make it hard to make friends or keep connections. Therapy can really help with this. Feeling this way does not mean people do not like you.'
            },
            {
                title: 'Fear of Burdening Others',
                content: 'Many lonely people avoid reaching out because they fear being a burden. This belief is often false - people generally want to help and feel valued when trusted with someone struggles. The fear of rejection or being "too much" can be a symptom of depression or anxiety. Starting with small, low-stakes connections can help build confidence. Remember: healthy relationships include both giving and receiving support.',
                eli10: 'When you feel lonely, you might not reach out because you are afraid of being a burden or annoying people. But this is usually not true - most people actually want to help and feel good when someone trusts them. This fear might come from feeling down or anxious. Start with small connections to build confidence. Real friendships mean both people help each other.'
            },
            {
                title: 'Reaching Out',
                content: 'Reaching out to others can be difficult when feeling lonely, but connection is essential for wellbeing. Start with small steps: send a text to someone you have not spoken to in a while, join a group or class with shared interests, volunteer, or simply say hello to a neighbor. Online communities can also provide connection, though in-person interaction is especially valuable. Remember that rejection is a normal part of social life and does not reflect your worth.',
                eli10: 'When you feel lonely, reaching out can feel scary. But connection helps. Start small - maybe just send a text to someone you have not talked to in a while, join a club about something you like, or say hi to a neighbor. You can also find people online, but meeting in person is especially good. Remember that sometimes people might say no, and that is okay - it does not mean you are not worth knowing.'
            },
            {
                title: 'Conversation Starters',
                content: 'Starting conversations can feel daunting. Try open-ended questions: "What is something good that happened to you this week?" "What are you looking forward to?" or "How did you get into [shared interest]?" Listen actively and ask follow-up questions. Share something about yourself too - vulnerability invites connection. It is okay if conversations feel awkward at first; social skills improve with practice.',
                eli10: 'Starting conversations can be really hard. Try asking questions that need more than a yes or no answer, like "What is something good that happened this week?" or "What are you excited about?" Listen carefully and ask more questions. Share about yourself too - being open helps others feel comfortable too. It is okay if conversations feel awkward at first - you get better with practice.'
            },
            {
                title: 'Building Connections',
                content: 'Building meaningful connections takes time and effort. Focus on quality over quantity - one or two close relationships are more fulfilling than many superficial ones. Be a good listener, show genuine interest in others, be reliable, and be patient with the process. Consistency matters more than intensity in building relationships. Remember that you deserve connection and have value to offer others.',
                eli10: 'Making real friends takes time. It is better to have one or two good friends than lots of people you do not really know. Listen to others, be interested in them, be someone people can count on, and give it time. Being consistent matters more than being super intense sometimes. Remember that you deserve friends and you have good things to offer too.'
            },
            {
                title: 'When to Seek Help',
                content: 'Consider seeking help if loneliness is persistent and affecting your daily life, if you are experiencing symptoms of depression or anxiety, if you are having thoughts of self-harm, or if you have no one to turn to. A therapist can help explore underlying causes of loneliness and develop strategies for building connections. Support groups can also provide understanding and connection with others experiencing similar challenges.',
                eli10: 'It is good to get help if loneliness has lasted a long time and is making daily life hard, if you are feeling depressed or anxious, if you are thinking about hurting yourself, or if you really have no one to talk to. A therapist can help figure out why you feel lonely and teach you ways to make connections. Support groups can also help because you meet other people who understand what you are going through.'
            }
        ],
        tools: ['loneliness-companion', 'journal']
    },
    adhd: {
        title: 'Understanding ADHD',
        icon: '⚡',
        color: '#FFB74D',
        description: 'ADHD (Attention Deficit Hyperactivity Disorder) affects how you focus, stay organized, and control impulses. It is a neurodevelopmental condition, not a character flaw.',
        topics: [
            {
                title: 'What is ADHD?',
                content: 'ADHD is a neurodevelopmental disorder that affects executive function - the brain is management system. It can manifest as difficulty sustaining attention, hyperactivity, and impulsivity. ADHD is not a result of poor parenting or lack of discipline. It affects approximately 4-5% of adults and is often underdiagnosed, especially in women. ADHD has three main types: predominantly inattentive, predominantly hyperactive-impulsive, and combined. It is a lifelong condition, but symptoms and management strategies can change over time.',
                eli10: 'ADHD is like having a brain that works differently. It can make it hard to focus, sit still, or remember things. It is not because you are bad or lazy - your brain just processes things in a unique way. Many people have ADHD - about 1 in 20 adults. It is something you are born with, not something that happened because of how you were raised.'
            },
            {
                title: 'Executive Dysfunction',
                content: 'Executive dysfunction refers to difficulties with planning, organizing, initiating tasks, and completing goals. It is a core feature of ADHD that can make everyday tasks feel overwhelming. This includes trouble with working memory (holding information in mind), emotional regulation, and flexible thinking. Executive dysfunction is not laziness or lack of trying - it is a neurological difference. External supports like lists, reminders, and body doubling (working alongside someone else) can help compensate.',
                eli10: 'Executive dysfunction is like having a messy desk in your brain. You know what you need to do, but starting and finishing tasks feels really hard. It is not your fault - your brain is organizer is different. This includes trouble remembering things in the moment, managing feelings, and switching between tasks. Using lists, alarms, and working near someone else can really help.'
            },
            {
                title: 'Time Blindness',
                content: 'Time blindness is the difficulty perceiving the passage of time. People with ADHD may struggle to estimate how long tasks will take, lose track of time easily, or feel like time moves differently than others. This can lead to chronic lateness, procrastination, or difficulty pacing work. Using multiple timers, visual time displays, and external time cues can help. Time blindness is neurological, not a personal failing.',
                eli10: 'Time blindness is when time feels weird - like it moves too fast or too slow. You might think a task will take 5 minutes but it takes an hour. It is like your internal clock is a bit off. This can make you late often or put things off until the last minute. Using lots of timers, clocks you can see, and having other people remind you about time can help.'
            },
            {
                title: 'Dopamine and Motivation',
                content: 'ADHD brains often have lower levels of dopamine, a neurotransmitter involved in motivation, reward, and pleasure. This can make it difficult to feel motivated for tasks that are not immediately rewarding. The ADHD brain seeks dopamine through stimulation, novelty, and urgency (hence procrastination until deadlines). Understanding this biological basis can reduce self-blame. Strategies include gamifying tasks, adding novelty, working in short bursts, and creating artificial urgency.',
                eli10: 'ADHD brains often have less dopamine - a chemical that helps you feel motivated and rewarded. This makes it hard to want to do things that are not immediately fun or exciting. The ADHD brain looks for excitement and new things, which is why you might wait until the last minute to do things. Understanding this is biological, not your fault. You can make tasks more like games, add new elements, work in short bursts, or create your own deadlines to help.'
            },
            {
                title: 'Task Paralysis',
                content: 'Task paralysis (also called ADHD paralysis) is the inability to start or complete tasks, even when you want to. This can happen because tasks feel overwhelming, because you do not know where to start, or because your brain cannot prioritize what to do first. Breaking tasks into tiny steps (smaller than you think necessary), using the "two-minute rule" (if it takes less than two minutes, do it now), and body doubling can help overcome paralysis.',
                eli10: 'Task paralysis is when you cannot start or finish tasks, even when you want to. This happens when tasks feel too big, you do not know where to begin, or your brain cannot decide what is most important. Breaking tasks into tiny pieces - smaller than you think - helps. Also, if something takes less than two minutes, do it right away. Working near someone else can also help you get started.'
            },
            {
                title: 'Emotional Dysregulation',
                content: 'Many people with ADHD experience emotional dysregulation - intense emotions that can be difficult to manage. This might look like quick anger, frustration, or sadness that feels overwhelming. Rejection Sensitive Dysphoria (RSD) is common - intense emotional pain from perceived rejection or criticism. These experiences are neurological, not character flaws. Learning coping strategies, working with a therapist, and sometimes medication can help manage emotional intensity.',
                eli10: 'Many people with ADHD have big feelings that are hard to control. You might get angry, frustrated, or sad very intensely. Rejection Sensitive Dysphoria (RSD) is when criticism or feeling rejected hurts extra badly. These feelings come from how your brain works, not from being a bad person. Learning ways to cope, talking to a therapist, and sometimes medicine can help with these big feelings.'
            },
            {
                title: 'ADHD-Friendly Strategies',
                content: 'Helpful strategies include breaking tasks into smaller steps (make them tiny), using timers and reminders (multiple methods), creating visual schedules, minimizing distractions (phone in another room), working with your body is natural rhythms (do hard tasks during your peak energy times), body doubling (work alongside someone), gamification, and celebrating small wins. External structure is key because ADHD brains struggle with internal structure. Be patient with yourself as you find what works.',
                eli10: 'To help with ADHD, try breaking big tasks into tiny pieces - really tiny. Use lots of alarms and reminders to remember things. Make colorful schedules you can see. Put your phone in another room so it does not distract you. Do hard work when you have the most energy. Work near someone else. Make tasks like games. Feel proud of every small thing you accomplish. Having structure from outside helps because ADHD brains have trouble making their own structure.'
            },
            {
                title: 'When to Seek Help',
                content: 'Consider seeking professional help if ADHD symptoms significantly impact your work, relationships, or daily life; if you are experiencing emotional dysregulation that is difficult to manage; or if you suspect you have undiagnosed ADHD. Diagnosis by a qualified professional can open doors to treatment options including medication, therapy (CBT, coaching), and accommodations at work or school. ADHD is highly treatable, and proper support can dramatically improve quality of life.',
                eli10: 'It is good to get help if ADHD makes work, relationships, or daily life really hard, if your big feelings are difficult to manage, or if you think you might have ADHD but have not been diagnosed. A professional can diagnose ADHD and help with treatment like medicine, therapy, or coaching. This can help at work or school too. ADHD can be treated very well, and the right support can make life much better.'
            }
        ],
        tools: ['focus-timer', 'brain-dump']
    },
    ocd: {
        title: 'Understanding OCD',
        icon: '🔁',
        color: '#A8C3A1',
        description: 'OCD (Obsessive-Compulsive Disorder) involves unwanted recurring thoughts (obsessions) and repetitive behaviors (compulsions). It is treatable and you are not alone.',
        topics: [
            {
                title: 'What is OCD?',
                content: 'OCD is characterized by unwanted, intrusive thoughts (obsessions) that cause anxiety, and repetitive behaviors or mental acts (compulsions) performed to reduce that anxiety. These thoughts and behaviors can be time-consuming and distressing, taking up more than an hour per day and significantly impacting daily life. OCD affects approximately 1-2% of the population. Common subtypes include contamination OCD, checking OCD, symmetry OCD, and harm OCD. OCD is not about being organized or neat - that is a common misconception.',
                eli10: 'OCD is like having unwanted thoughts that keep popping into your head, and feeling like you have to do certain things over and over to feel okay. The thoughts do not mean anything bad about you - they are just stuck thoughts. OCD affects about 1 in 50 people. It is not about being organized or tidy - that is a common mistake people make.'
            },
            {
                title: 'Obsessions',
                content: 'Obsessions are recurrent, unwanted thoughts, images, or urges that cause anxiety or distress. Common obsessions include fear of contamination, fear of harming oneself or others, unwanted sexual thoughts, religious or moral concerns, need for symmetry/exactness, and fear of losing control. These thoughts feel intrusive and ego-dystonic - meaning they go against your values and desires. Having these thoughts does not mean you want to act on them.',
                eli10: 'Obsessions are unwanted thoughts that keep coming back and make you anxious. Common ones include worrying about germs, worrying you might hurt someone, having thoughts about sex that you do not want, worrying about religion or morals, needing things to be perfectly even, or fearing you will lose control. These thoughts feel like they do not belong to you and go against who you really are. Having them does not mean you want to do them.'
            },
            {
                title: 'Intrusive Thoughts',
                content: 'Intrusive thoughts are unwanted thoughts that can be disturbing or distressing. Having these thoughts does not mean you want to act on them or that they reflect your true desires. They are a symptom of OCD, not a reflection of your character. Everyone has intrusive thoughts occasionally, but people with OCD get stuck on them. The more you try to suppress them, the more they persist. Learning to accept their presence without engaging with them is part of recovery.',
                eli10: 'Intrusive thoughts are like having a pop-up ad in your brain that you did not ask for. The thoughts can be scary or weird, but having them does not mean you are a bad person. Everyone has these thoughts sometimes, but people with OCD get stuck on them. Trying to push them away makes them come back more. Learning to let them be there without paying attention to them helps you get better.'
            },
            {
                title: 'Compulsions',
                content: 'Compulsions are repetitive behaviors or mental acts that a person feels driven to perform in response to an obsession. Common compulsions include excessive handwashing, checking (locks, appliances, etc.), counting, repeating actions, seeking reassurance, mental reviewing, and arranging objects. While they may provide temporary relief, they do not address the underlying anxiety and can reinforce the OCD cycle. Compulsions are not habits - they are performed to reduce anxiety, not because you enjoy them.',
                eli10: 'Compulsions are things you feel like you HAVE to do, like washing your hands many times, checking locks or appliances over and over, counting things, repeating actions, asking for reassurance, going over thoughts in your head, or arranging objects perfectly. They might make you feel better for a moment, but then the feeling comes back. These are not habits - you do them because you feel anxious, not because you like them.'
            },
            {
                title: 'Checking and Reassurance',
                content: 'Checking compulsions involve repeatedly verifying things to prevent harm or reduce anxiety. This might include checking locks, appliances, that you did not hurt someone, or that you did not make a mistake. Reassurance seeking involves repeatedly asking others for confirmation that things are okay. Both provide temporary relief but strengthen the OCD cycle. Learning to tolerate uncertainty is a key part of recovery. The anxiety from not checking is uncomfortable but not dangerous.',
                eli10: 'Checking compulsions are when you check things over and over to make sure nothing bad will happen or to feel less anxious. This might mean checking locks, checking that you did not hurt anyone, or checking that you did not make mistakes. Reassurance seeking is asking people over and over if things are okay. These help for a moment but make OCD stronger. Learning to handle not knowing for sure is important. The anxiety from not checking feels bad but is not actually dangerous.'
            },
            {
                title: 'The OCD Cycle',
                content: 'OCD operates in a cycle: obsession (anxiety-triggering thought) → anxiety → compulsion (behavior to reduce anxiety) → temporary relief → obsession returns. Each time you perform a compulsion, you reinforce the cycle. Breaking the cycle involves Exposure and Response Prevention (ERP) - facing the obsession without performing the compulsion. This is difficult at first but gets easier with practice. The anxiety will eventually decrease on its own without the compulsion.',
                eli10: 'OCD works in a circle: you have a scary thought, you feel anxious, you do something to feel better, you feel okay for a moment, then the scary thought comes back. Every time you do the compulsion, you make the circle stronger. Breaking the circle means facing the scary thought without doing the compulsion. This is hard at first but gets easier. The anxiety will go down on its own even without the compulsion.'
            },
            {
                title: 'Breaking the Cycle',
                content: 'Treatment for OCD often involves Exposure and Response Prevention (ERP) therapy, which is considered the gold standard. ERP helps gradually face fears without performing compulsions, teaching your brain that the feared outcome does not happen. Cognitive-behavioral therapy (CBT) can help challenge distorted thinking. Medication (SSRIs) can also be effective. Recovery is possible - many people with OCD live full, satisfying lives with proper treatment.',
                eli10: 'To help with OCD, therapists use a special kind of therapy called ERP where you practice facing the scary thoughts without doing the compulsions. This teaches your brain that the bad thing you fear does not actually happen. CBT therapy can help with the thoughts too. Medicine can also help. Recovery is possible - many people with OCD have happy, full lives with the right treatment.'
            },
            {
                title: 'When to Seek Help',
                content: 'Seek professional help if obsessions or compulsions take up more than an hour per day, significantly impact your daily life, cause distress, or if you are avoiding situations due to OCD. OCD is highly treatable with ERP therapy and sometimes medication. The earlier treatment begins, the better the outcomes. You deserve relief from the burden of OCD.',
                eli10: 'Get professional help if the unwanted thoughts or compulsions take more than an hour each day, if they make daily life hard, if they cause you distress, or if you avoid things because of OCD. OCD can be treated very well with ERP therapy and sometimes medicine. Getting help early works better. You deserve to feel better from the burden of OCD.'
            }
        ],
        tools: ['grounding', 'journal']
    },
    stress: {
        title: 'Understanding Stress & Burnout',
        icon: '🌪️',
        color: '#E57373',
        description: 'Stress is your body is response to pressure. Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.',
        topics: [
            {
                title: 'What is Stress?',
                content: 'Stress is the body is natural defense against predators and danger. It flushes the body with hormones to prepare systems to evade or confront danger. While acute stress can be helpful (motivating action), chronic stress can have serious health effects including cardiovascular problems, weakened immune system, digestive issues, and mental health challenges. Stress affects nearly everyone, and learning to manage it is an essential life skill.',
                eli10: 'Stress is your body is alarm system. When something feels challenging or scary, your body gets ready to handle it. A little stress can help you do things, but too much stress for too long is not good for your body or mind. Almost everyone feels stressed sometimes, and learning to handle it is an important skill.'
            },
            {
                title: 'Acute vs Chronic Stress',
                content: 'Acute stress is short-term and can be beneficial - it helps you respond to immediate challenges and then subsides. Chronic stress is long-term stress that persists over weeks or months, keeping your body in a constant state of alert. Chronic stress is the type that causes health problems. Signs include constant worrying, irritability, difficulty sleeping, changes in appetite, and physical symptoms like headaches or muscle tension.',
                eli10: 'Acute stress is short-term stress that can actually help you - it gets you ready to handle something right now, then goes away. Chronic stress is long-term stress that lasts for weeks or months, keeping your body always on high alert. This is the kind that hurts your health. Signs include always worrying, being irritable, trouble sleeping, appetite changes, headaches, or tight muscles.'
            },
            {
                title: 'Burnout',
                content: 'Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands. Burnout reduces productivity and saps your energy, leaving you feeling helpless, cynical, and resentful. It often results from prolonged work stress, but can also come from caregiving responsibilities or other life demands. Recovery requires significant rest and lifestyle changes.',
                eli10: 'Burnout is like running a marathon without ever stopping. You keep going and going until you feel completely empty and exhausted. It happens when you have been stressed for too long without enough rest. You might feel overwhelmed, emotionally drained, unable to keep up, and maybe even helpless or resentful. Getting better from burnout takes real rest and big changes in how you live.'
            },
            {
                title: 'Academic Burnout',
                content: 'Academic burnout affects students who feel overwhelmed by constant pressure to perform, excessive workload, and high expectations. Symptoms include loss of motivation for learning, cynicism about education, feeling like you are not good enough, and physical exhaustion. It is important to remember that your worth is not tied to your grades. Seeking support from counselors, professors, or peers can help. Taking breaks and maintaining balance is essential.',
                eli10: 'Academic burnout happens to students who feel too much pressure to do well, have too much work, and feel like expectations are too high. You might lose motivation for learning, feel cynical about school, feel like you are not good enough, and feel exhausted. Remember that your worth is not your grades. Getting help from counselors, teachers, or friends can help. Taking breaks and keeping balance in your life is important.'
            },
            {
                title: 'Work Burnout',
                content: 'Work burnout results from chronic workplace stress that has not been successfully managed. Signs include feeling drained by work, reduced professional efficacy, cynicism about work, and physical symptoms. Contributing factors include unfair treatment, unmanageable workload, lack of control, lack of support, and poor work-life balance. Addressing burnout may require setting boundaries, communicating with supervisors, or in some cases, changing jobs or careers.',
                eli10: 'Work burnout happens when job stress never gets better and you cannot handle it. Signs include feeling drained by work, feeling like you are not doing a good job, feeling negative about your job, and having physical symptoms. It happens when work is unfair, there is too much to do, you have no control, no support, or no balance between work and life. Fixing it might mean setting limits, talking to your boss, or sometimes changing jobs.'
            },
            {
                title: 'Perfectionism',
                content: 'Perfectionism is the tendency to set unrealistically high standards and being overly critical of oneself. While striving for excellence can be positive, perfectionism can lead to stress, anxiety, and burnout. Perfectionists often fear failure, procrastinate due to fear of not doing things perfectly, and tie their self-worth to achievement. Learning to accept "good enough" and recognizing that mistakes are part of growth can help reduce perfectionist tendencies.',
                eli10: 'Perfectionism is when you feel like everything has to be exactly perfect, and you are really hard on yourself when it is not. It is like trying to draw a perfect circle every single time - it is exhausting and makes you feel bad. Perfectionists often fear failing, put things off because they are scared of not doing them perfectly, and think their worth depends on achieving things. Learning that "good enough" is okay and that mistakes help you grow can help.'
            },
            {
                title: 'Nervous System Overload',
                content: 'When stress becomes chronic, your nervous system can become stuck in "fight or flight" mode, constantly flooding your body with stress hormones. This can lead to anxiety, irritability, sleep problems, and physical health issues. Calming your nervous system requires intentional practices: deep breathing, progressive muscle relaxation, spending time in nature, gentle exercise, and reducing stimulation. Creating periods of true rest is essential for nervous system regulation.',
                eli10: 'When stress lasts a long time, your nervous system can get stuck in "fight or flight" mode, always flooding your body with stress chemicals. This can make you anxious, irritable, unable to sleep well, and have health problems. Calming your nervous system takes intentional work: breathing deeply, relaxing your muscles one by one, spending time in nature, gentle exercise, and reducing stimulation. Creating real rest time is really important for your nervous system.'
            },
            {
                title: 'Recovery Strategies',
                content: 'Recovering from stress and burnout requires real rest, not just "working harder." Set boundaries on your time and energy. Practice self-compassion - treat yourself as you would treat a friend. Prioritize sleep (7-9 hours), nutrition, and movement. Engage in activities that bring you joy, not productivity. Seek support from friends, family, or professionals. Remember: rest is productive and necessary. You cannot pour from an empty cup.',
                eli10: 'To recover from burnout, you need real rest, not just working harder. Set limits on what you do and how much energy you use. Be kind to yourself - treat yourself like you would treat a friend. Sleep enough, eat well, and move your body. Do things that make you happy, not just productive things. Get help from friends, family, or professionals. Remember that rest is productive and necessary. You cannot help others if you are empty yourself.'
            },
            {
                title: 'When to Seek Help',
                content: 'Seek professional help if stress is affecting your physical health, if you are experiencing symptoms of anxiety or depression, if you are using substances to cope, if burnout is affecting your ability to function, or if you feel hopeless. A therapist can help develop coping strategies, identify sources of stress, and work on underlying issues. Sometimes medication can help with anxiety or depression that accompanies chronic stress.',
                eli10: 'Get professional help if stress is hurting your physical health, if you have anxiety or depression symptoms, if you are using drugs or alcohol to cope, if burnout stops you from functioning, or if you feel hopeless. A therapist can help you learn ways to cope, figure out what is causing stress, and work on deeper issues. Sometimes medicine can help with anxiety or depression that comes with long-term stress.'
            }
        ],
        tools: ['calm-down', 'breathing', 'journal']
    }
};

// Current state
let currentTopic = null;
let eli10Mode = false;

// Initialize Mental Health Module
function initializeMentalHealth() {
    console.log('🧠 Initializing Mental Health module...');
    console.log('✅ Mental Health module initialized');
}

// ============================================
// LOAD TOPIC CONTENT
// ============================================

function loadMentalHealthTopic(topicId) {
    const content = mentalHealthContent[topicId];
    if (!content) {
        console.error('Topic not found:', topicId);
        return;
    }
    
    currentTopic = topicId;
    eli10Mode = false;
    
    const contentArea = document.getElementById('mentalhealth-content');
    if (contentArea) {
        contentArea.classList.remove('hidden');
        contentArea.innerHTML = generateTopicHTML(content);
        
        // Scroll to content
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function generateTopicHTML(content) {
    let html = `
        <div class="topic-header">
            <span class="topic-icon" style="font-size: 48px;">${content.icon}</span>
            <h2 style="color: ${content.color};">${content.title}</h2>
            <p>${content.description}</p>
            <button class="secondary-btn" onclick="toggleELI10Mode()" style="margin-top: 16px;">
                ${eli10Mode ? '📖 Show Full Version' : '👶 ELI10 Mode'}
            </button>
        </div>
    `;
    
    content.topics.forEach((topic, index) => {
        html += `
            <div class="topic-section">
                <h3>${topic.title}</h3>
                <p class="topic-content ${eli10Mode ? 'hidden' : ''}">${topic.content}</p>
                <p class="topic-eli10 ${eli10Mode ? '' : 'hidden'}">${topic.eli10}</p>
            </div>
        `;
    });
    
    // Add related tools
    if (content.tools && content.tools.length > 0) {
        html += `
            <div class="topic-tools">
                <h3>Related Tools</h3>
                <div class="tool-buttons">
        `;
        
        content.tools.forEach(tool => {
            html += `<button class="primary-btn" onclick="navigateTo('coping', '${tool}')">Open ${tool.replace('-', ' ')}</button>`;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    return html;
}

// ============================================
// ELI10 MODE TOGGLE
// ============================================

function toggleELI10Mode() {
    eli10Mode = !eli10Mode;
    
    if (currentTopic) {
        const content = mentalHealthContent[currentTopic];
        const contentArea = document.getElementById('mentalhealth-content');
        
        if (contentArea) {
            contentArea.innerHTML = generateTopicHTML(content);
        }
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function searchMentalHealthContent(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const [topicId, content] of Object.entries(mentalHealthContent)) {
        // Search in title and description
        if (content.title.toLowerCase().includes(lowerQuery) ||
            content.description.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'topic',
                topicId: topicId,
                title: content.title,
                icon: content.icon
            });
        }
        
        // Search in topics
        content.topics.forEach((topic, index) => {
            if (topic.title.toLowerCase().includes(lowerQuery) ||
                topic.content.toLowerCase().includes(lowerQuery) ||
                topic.eli10.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'section',
                    topicId: topicId,
                    sectionIndex: index,
                    title: topic.title,
                    icon: content.icon
                });
            }
        });
    }
    
    return results;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.loadMentalHealthTopic = loadMentalHealthTopic;
window.toggleELI10Mode = toggleELI10Mode;
window.searchMentalHealthContent = searchMentalHealthContent;

// Structured Knowledge Index for Chatbot Retrieval
const MindHavenLearnIndex = [
    {
        id: 'anxiety',
        title: 'Understanding Anxiety',
        category: 'anxiety',
        tags: ['anxiety', 'panic', 'worry', 'fight or flight', 'social anxiety', 'overthinking'],
        relatedTools: ['box_breathing', 'grounding_54321']
    },
    {
        id: 'depression',
        title: 'Understanding Depression',
        category: 'depression',
        tags: ['depression', 'sadness', 'low energy', 'numbness', 'motivation', 'hopelessness'],
        relatedTools: ['cbt_reframe', 'journal']
    },
    {
        id: 'emotions',
        title: 'Emotional Regulation & DBT',
        category: 'emotions',
        tags: ['emotions', 'anger', 'dbt', 'overwhelm', 'feelings', 'tIPP'],
        relatedTools: ['emotion_wheel', 'tipp', 'grounding_54321']
    },
    {
        id: 'stress',
        title: 'Burnout & Somatic Stress Release',
        category: 'stress',
        tags: ['burnout', 'stress', 'somatic', 'workplace', 'exhaustion', 'nervous system'],
        relatedTools: ['pmr', 'box_breathing']
    },
    {
        id: 'attention',
        title: 'ADHD & Executive Functioning',
        category: 'attention',
        tags: ['adhd', 'focus', 'executive function', 'dopamine', 'procrastination', 'hyperfocus'],
        relatedTools: ['cbt_reframe', 'dashboard']
    },
    {
        id: 'sleep_hygiene',
        title: 'Sleep Hygiene & Circadian Health',
        category: 'sleep',
        tags: ['sleep', 'insomnia', 'circadian', 'wind down', 'rest', 'night racing'],
        relatedTools: ['pmr', 'calmspace']
    }
];

window.MindHavenLearnIndex = MindHavenLearnIndex;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeMentalHealth();
});
