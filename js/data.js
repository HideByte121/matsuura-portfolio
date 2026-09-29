// 公開用のメールアドレス。空欄ではリンクを表示しません。
const portfolio = { email: 'matsuura.hideyuki1111001@gmail.com' };

// 公開済みURLとの互換性のため、id は変更しません。
// youtubeId はYouTube動画のID。画像は任意で追加できます。
const works = [
  {
    id: 'sample-01',
    title: '5GameBowling',
    summary: 'C++とDirectXで初めて制作した3Dボウリングゲーム。ピンの当たり判定や、衝突後の倒れ方・ばらけ方に取り組みました。',
    tools: 'C++ / DirectX',
    youtubeId: 'zbY_-nGU9DM',
    thumbnail: '',
    images: [],
    description: 'DirectXを使い、初めて3Dゲーム制作に取り組んだ個人作品です。ボウリングを題材に、3Dモデルの制御や当たり判定など、3Dゲームの基本的な仕組みを実装しました。',
    period: '約1か月',
    teamSize: '1人（個人制作）',
    role: '制作全般',
    highlights: '特に力を入れたのは、ピンの制御です。衝突後にピンがどのように倒れ、周囲へばらけるかを意識して挙動を調整しました。初めての3D制作で当たり判定やモデルの制御に苦労しながらも、動作を確かめながら実装を進めました。',
    technicalNotes: [
      {
        "title": "細長いピンを3つの球で近似する",
        "problem": "ピンは縦に長いため、中心に球を1つ置くだけでは、見た目に合う当たり判定を作りにくいと考えました。",
        "approach": "ピンの中心・上・下に3つの球を配置し、どれか1つがボールに触れたら衝突と判定する形にしました。上下の間隔にはピンの高さの1/4を使い、モデルの大きさを判定位置に反映しています。",
        "point": "複雑なモデル形状をそのまま判定する代わりに、球同士の判定を組み合わせています。球の中心間距離は二乗のまま比較し、接触の有無を求める段階では平方根の計算を使わない実装です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 175–198行（抜粋）",
            "code": "constexpr int SPHERE_CENTERS_COUNT = 3;\n\nfloat offset = pin.GetHeight() * 0.25f;\nVector3 pinPos = pin.GetPosition();\n\nVector3 sphereCenters[SPHERE_CENTERS_COUNT] = {\n    pinPos,\n    Vector3(pinPos.x, pinPos.y + offset, pinPos.z),\n    Vector3(pinPos.x, pinPos.y - offset, pinPos.z)\n};\n\nfor (int i = 0; i < SPHERE_CENTERS_COUNT; i++)\n{\n    if (CheckCircleCollider3D(\n        ball.GetPosition(),\n        ball.GetScaledRadius(),\n        sphereCenters[i],\n        pin.GetRadius()))\n    {\n        return true;\n    }\n}\n\nreturn false;"
          },
          {
            "source": "collision.cpp / 35–48行（抜粋）",
            "code": "Vector3 Length;\nLength.x = PosA.x - PosB.x;\nLength.y = PosA.y - PosB.y;\nLength.z = PosA.z - PosB.z;\n\nfloat dist2 = (Length.x * Length.x) + (Length.y * Length.y) + (Length.z * Length.z);\nfloat R = (RadiusA + RadiusB) * (RadiusA + RadiusB);\n\nif (dist2 < R)\n{\n    return true;\n}\n\nreturn false;"
          }
        ]
      },
      {
        "title": "衝突位置から、ピンが倒れる向きを決める",
        "problem": "ピンが常に同じ方向へ倒れると、ボールを当てた位置と見た目の反応がつながりにくくなります。",
        "approach": "ボールからピンへ向かう方向をXZ平面で求め、正規化して倒れる方向として保存しました。描画時にはその方向に直交する回転軸を作り、倒れる角度を適用しています。",
        "point": "倒れる向きと移動速度を別々に扱っています。向きは衝突位置から、移動速度はボールの速度から決めることで、当たった位置と勢いをそれぞれ表現に使っています。これは簡易的な挙動制御で、厳密な剛体シミュレーションではありません。",
        "snippets": [
          {
            "source": "pin.cpp / 148–173行（抜粋）",
            "code": "Vector3 ballPos = ball.GetPosition();\n\nVector3 dir\n{\n\tm_Position.x - ballPos.x,\n\t0.0f,\n\tm_Position.z - ballPos.z\n};\n\nfloat len = sqrtf(dir.x * dir.x + dir.z * dir.z);\nif (len > 0.0001f)\n{\n\tdir.x /= len;\n\tdir.z /= len;\n}\n\nm_FallDir = dir;\n\nVector3 ballV = ball.GetVelocity();\nfloat power = 2.0f;\n\nm_Velocity.x += ballV.x * power;\nm_Velocity.z += ballV.z * power;\n\nm_IsFalling = true;\nm_FallAngle = 0.0f;"
          },
          {
            "source": "pin.cpp / 94–101行（抜粋）",
            "code": "Vector3 axis = { -m_FallDir.z, 0.0f, m_FallDir.x };\nfloat len = sqrtf(axis.x * axis.x + axis.z * axis.z);\nif (len > 0.0001f) {\n\taxis.x /= len;\n\taxis.z /= len;\n\tXMVECTOR axisVec = XMVectorSet(axis.x, axis.y, axis.z, 0.0f);\n\tmatrix.World *= XMMatrixRotationAxis(axisVec, m_FallAngle);\n}"
          }
        ]
      },
      {
        "title": "倒れる角度に合わせて、床からの高さを調整する",
        "problem": "立っているピンと横になったピンでは、床から中心までの高さが異なります。高さを固定すると、倒れたときに浮いたり床へめり込んだりする見た目につながります。",
        "approach": "床との接触時に、立っている状態では高さの半分、倒れきった状態では半径を中心の高さとして使いました。倒れている途中は、0〜90度の角度を割合に変換し、2つの高さの間を線形補間しています。",
        "point": "回転だけでなく位置も変えることで、倒れていく途中の接地の見た目を調整しています。形状に厳密に沿った接触計算ではなく、少ない計算で姿勢に合わせた高さを得る近似です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 138–157行（抜粋・コメント省略）",
            "code": "if (!pin.IsFalling() || pin.GetFallAngle() <= 0.01f)\n{\n    yOffset = pin.GetHeight() * 0.5f;\n}\n\n\nelse if (pin.GetFallAngle() >= XM_PIDIV2 - 0.01f)\n{\n    yOffset = pinRadius;\n}\n\nelse\n{\n    float t = pin.GetFallAngle() / XM_PIDIV2;\n    float standY = pin.GetHeight() * 0.5f;\n    float lieY = pinRadius;\n    yOffset = standY * (1.0f - t) + lieY * t;\n}\n\npinPos.y = modelTopSurface + yOffset;"
          }
        ]
      },
      {
        "title": "ピン同士で倒れる動きを連鎖させる",
        "problem": "ボールが直接当たったピンだけが倒れるのでは、ボウリングらしいばらけ方を表現できません。",
        "approach": "倒れているピンと立っているピンが接触したら、立っている側に衝突処理を渡すようにしました。衝突相手から離れる方向と、そのピンの水平速度を使って次のピンの動きを決めています。",
        "point": "受け渡す速さには「相手の速さ×0.8」と「最低値2.0」の大きい方を使います。低速でも一定の動きを与える調整で、物理的な正確さだけでなく、ピンが連鎖して倒れる見た目を意識した実装です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 259–268行（抜粋）",
            "code": "if (pinA.IsFalling() && !pinB.IsFalling())\n{\n    pinB.OnHitByPin(pinA);\n    velB = pinB.GetVelocity();\n}\nelse if (!pinA.IsFalling() && pinB.IsFalling())\n{\n    pinA.OnHitByPin(pinB);\n    velA = pinA.GetVelocity();\n}"
          },
          {
            "source": "pin.cpp / 196–205行（抜粋）",
            "code": "Vector3 pinV = pin.GetVelocity();\nfloat speed = sqrtf(pinV.x * pinV.x + pinV.z * pinV.z);\nfloat power = std::max(speed * 0.8f, 2.0f);\n\nm_FallDir = dir;\nm_Velocity.x += dir.x * power;\nm_Velocity.z += dir.z * power;\n\nm_IsFalling = true;\nm_FallAngle = 0.0f;"
          }
        ]
      }
    ],
    links: []
  },
  {
    id: 'sample-02',
    title: 'RE：TRACE',
    summary: '行動を録画・再生し、過去の自分と協力して進む2Dパズルアクション。7人でのチーム制作で、ギミックとシェーダーを担当しました。',
    tools: 'C# / Unity',
    youtubeId: 'YBtmxOndqW8',
    thumbnail: '',
    images: [],
    description: '自分の移動やギミック操作を記録し、その動きを再現する「リプレイ」と協力してゴールを目指す2Dパズルアクションゲームです。複数のリプレイを組み合わせ、ボタン、動く床、シャッターなどを活用してステージを攻略します。Unityを使い、7人のチームで制作しました。',
    period: '約2か月',
    teamSize: '7人（チーム制作）',
    role: 'ギミック制作・シェーダー制作',
    highlights: 'チームのメンバーがコードを変更せずに調整できるよう、ギミックの設定をUnityのインスペクターから操作できる形にしました。\n\n同じボタンでも異なる挙動に対応できるよう、C#の継承を活用して共通処理と個別の処理を整理しました。UnityとC#の使い方を学びながら実装し、制作の終盤にはシェーダー制作にも取り組みました。',
    technicalNotes: [
      {
        "title": "チームで設定しやすい、共通のボタン設計",
        "problem": "チームでステージを組む際、ボタンの接続先や判定対象を変えるたびにコードを修正する手間を減らしたいと考えました。",
        "approach": "判定対象のタグや接続先をSerializeFieldで公開し、インスペクターから設定できるようにしました。押し続ける・切り替える・一定時間だけ動かすボタンはButtonBaseを継承し、対象の検出やボタンの移動処理を共通化しています。",
        "point": "接続先はButtonTargetBaseという共通の型で扱います。ボタン側は押下・解除の信号を送り、床やシャッター側がそれぞれの動作を決める構成にして、組み合わせを設定で変えられるようにしました。",
        "snippets": [
          {
            "source": "Scripts/modify/ButtonBase.cs / 3–21行（抜粋）",
            "language": "csharp",
            "code": "public class ButtonBase : MonoBehaviour\n{\n    [Header(\"共通設定\")]\n    [Header(\"ボタンを押せるオブジェクトのタグ\")]\n    [SerializeField] protected string[] targetTags = { \"Player\" };\n\n    [Header(\"信号を送る対象オブジェクト\")]\n    [SerializeField] protected ButtonTargetBase[] targetObjects;\n\n    // 音を再生するマネージャー\n    protected AudioManager audioManager;\n\n    [Header(\"ボタン設定\")]\n    [Tooltip(\"ボタンが沈む量\")]\n    [SerializeField] protected float pressedOffsetY = -0.16f;\n    [Tooltip(\"ボタンが沈む量 (壁設置用)\")]\n    [SerializeField] protected float pressedOffsetX = 0.0f;\n    [Tooltip(\"ボタンの移動速度\")]\n    [SerializeField] protected float moveSpeed = 8f;"
          },
          {
            "source": "Scripts/modify/PushingButtonFunction.cs / 36–41行（抜粋）",
            "language": "csharp",
            "code": "if (targetObjects == null) return;\nforeach (ButtonTargetBase obj in targetObjects)\n{\n    if (obj != null)\n        obj.OnButtonPressed(); // カウンターを加算\n}"
          },
          {
            "source": "Scripts/modify/ButtonTargetBase.cs / 15–34行（抜粋）",
            "language": "csharp",
            "code": "public virtual void OnButtonPressed()\n{\n    signalFeedback?.PlayOnEffect();\n    currentPressCount++;\n    CheckState();\n}\n\npublic virtual void OnButtonReleased()\n{\n    signalFeedback?.PlayOffEffect();\n    currentPressCount = Mathf.Max(0, currentPressCount - 1);\n    CheckState();\n}\n\npublic virtual void OnTimerFinished()\n{\n    OnButtonReleased();\n}\n\nprotected abstract void CheckState();"
          }
        ]
      },
      {
        "title": "ボタンの見た目と、押されているかの判定を分ける",
        "problem": "ボタンが押し込まれる動きに判定範囲まで追従すると、接触状態が変わる原因になります。また、Transformで直接移動する対象を検出する方法も必要でした。",
        "approach": "毎フレーム、初期位置を基準としたボックス内を調べ、対象タグのオブジェクトがいるかを判定しています。押下状態が前のフレームから変化したときだけ、接続先へ押下・解除を通知します。",
        "point": "見た目の移動と判定位置を分離し、押されている間に同じ通知を繰り返さないようにしました。検出結果は8件分の配列を再利用しています。大量の対象が重なる場合まで保証する仕組みではなく、想定する配置に合わせた実装です。",
        "snippets": [
          {
            "source": "Scripts/modify/ButtonBase.cs / 34–35行（抜粋）",
            "language": "csharp",
            "code": "// 判定用バッファ（GC削減）\nprotected readonly Collider2D[] detectionHits = new Collider2D[8];"
          },
          {
            "source": "Scripts/modify/ButtonBase.cs / 46–73行（抜粋）",
            "language": "csharp",
            "code": "protected bool CheckForTag()\n{\n    // 判定ボックスはボタンの現在位置ではなく、初期位置を基準にする\n    // ボタンが押し込まれて移動しても、判定範囲が一緒にズレないようにする\n    Vector2 center = new Vector2(\n        initialPosition.x + detectionOffset.x,\n        initialPosition.y + detectionOffset.y\n    );\n\n    int hitCount = Physics2D.OverlapBoxNonAlloc(\n        center,\n        detectionSize,\n        0f,\n        detectionHits,\n        detectionLayer\n    );\n\n    for (int i = 0; i < hitCount; i++)\n    {\n        Collider2D hit = detectionHits[i];\n        if (hit == null) continue;\n\n        if (HasTargetTag(hit))\n            return true;\n    }\n\n    return false;\n}"
          },
          {
            "source": "Scripts/modify/PushingButtonFunction.cs / 13–23行（抜粋）",
            "language": "csharp",
            "code": "bool detected = CheckForTag();\n\n// 押下状態が変化したときのみイベントを発火\nif (detected != isPressed)\n{\n    isPressed = detected;\n    if (isPressed)\n        OnButtonPressed();\n    else\n        OnButtonReleased();\n}"
          }
        ]
      },
      {
        "title": "複数のボタンから、シャッターの開き具合を決める",
        "problem": "録画した過去の自分と協力するパズルで、複数のボタンの状態を1つのギミックに反映できる構成を考えました。",
        "approach": "受け取った押下信号の数と、インスペクターで指定した必要数を管理しています。シャッターではその割合を0〜1に収め、閉じた位置と開いた位置の間を補間して目標位置を求めます。",
        "point": "例えば必要数が2なら、1つの信号で半分、2つで全開となる目標位置を計算できます。信号を受けたときは目標を更新し、実際の移動はFixedUpdateで行うよう役割を分けています。",
        "snippets": [
          {
            "source": "Scripts/modify/ButtonTargetBase.cs / 8–27行（抜粋）",
            "language": "csharp",
            "code": "[Header(\"必要ボタン数\")]\n[SerializeField] protected int requiredPressCount = 1;\n\nprotected int currentPressCount;\n\npublic bool IsActivated => currentPressCount >= requiredPressCount;\n\npublic virtual void OnButtonPressed()\n{\n    signalFeedback?.PlayOnEffect();\n    currentPressCount++;\n    CheckState();\n}\n\npublic virtual void OnButtonReleased()\n{\n    signalFeedback?.PlayOffEffect();\n    currentPressCount = Mathf.Max(0, currentPressCount - 1);\n    CheckState();\n}"
          },
          {
            "source": "Scripts/modify/ShutterFunction.cs / 54–75行（抜粋）",
            "language": "csharp",
            "code": "private void FixedUpdate()\n{\n    if (!isInitialized) return;\n\n    // ボタン信号が変化していなくても、現在の割合から目標位置を維持する\n    UpdateTargetPosition();\n    MoveToTarget();\n}\n\nprotected override void CheckState()\n{\n    // ボタンイベントでは目標位置だけを更新し、Rigidbodyの移動はFixedUpdateで行う\n    if (!isInitialized) return;\n    UpdateTargetPosition();\n}\n\nprivate void UpdateTargetPosition()\n{\n    int safeRequiredPressCount = Mathf.Max(1, requiredPressCount);\n    float openRate = Mathf.Clamp01((float)currentPressCount / safeRequiredPressCount);\n    targetPosition = Vector2.Lerp(deactivatedPosition, activatedPosition, openRate);\n}"
          }
        ]
      },
      {
        "title": "床の出現・消滅を、シェーダーと当たり判定で連動させる",
        "problem": "床の表示を瞬時に切り替えるだけでなく、変化の途中も見せたいと考えました。その際、まだ見えない床に乗れてしまわないよう、当たり判定の切り替えも必要です。",
        "approach": "ノイズと方向の値を組み合わせ、しきい値に応じて描画を切り抜くディゾルブシェーダーを用意しました。境界には発光色を加え、C#から消滅量を時間で変化させています。演出中は当たり判定を無効にし、出現完了後に有効にします。",
        "point": "MaterialPropertyBlockを使い、共有マテリアル自体を変更せずに床ごとの消滅量を渡しています。消滅完了後には点線ガイドを表示し、床が存在する場所を残す構成です。描画の演出とゲーム上の状態を、完了コールバックでつないでいます。",
        "snippets": [
          {
            "source": "Shader/DisappearFloorDissolve.shader / 166–187行（抜粋）",
            "language": "hlsl",
            "code": "float dissolvePattern = lerp(\n    noiseValue,\n    directionValue,\n    saturate(_DirectionInfluence));\nfloat dissolveAmount = saturate(_DissolveAmount);\n\nclip(dissolvePattern - dissolveAmount - 0.0001);\n\nfloat edgeMask = 1.0 - smoothstep(\n    dissolveAmount,\n    dissolveAmount + _EdgeWidth,\n    dissolvePattern);\nfloat activeEffect = step(0.0001, dissolveAmount)\n    * step(dissolveAmount, 0.9999);\nedgeMask *= activeEffect;\n\nspriteColor.rgb = lerp(\n    spriteColor.rgb,\n    _EdgeColor.rgb * _EdgeStrength,\n    saturate(edgeMask * _EdgeColor.a));\nspriteColor.rgb *= spriteColor.a;\nreturn spriteColor;"
          },
          {
            "source": "Scripts/DisappearFloorVisualEffect.cs / 174–179行（抜粋）",
            "language": "csharp",
            "code": "private void ApplyDissolveAmount(float amount)\n{\n    targetRenderer.GetPropertyBlock(propertyBlock);\n    propertyBlock.SetFloat(DissolveAmountId, amount);\n    targetRenderer.SetPropertyBlock(propertyBlock);\n}"
          },
          {
            "source": "Scripts/modify/DisappearFloor.cs / 79–101行（抜粋）",
            "language": "csharp",
            "code": "// 演出中は見えない床へ乗ったり、点線が重なったりしないようにします。\nif (targetCollider != null)\n    targetCollider.enabled = false;\n\nif (hiddenGuideSprite != null)\n    hiddenGuideSprite.enabled = false;\n\nif (visible)\n{\n    visualEffect.PlayAppear(() =>\n    {\n        if (targetCollider != null)\n            targetCollider.enabled = true;\n    });\n}\nelse\n{\n    visualEffect.PlayDisappear(() =>\n    {\n        if (hiddenGuideSprite != null)\n            hiddenGuideSprite.enabled = true;\n    });\n}"
          }
        ]
      }
    ],
    links: []
  },
  {
    id: 'sample-03',
    title: '暖弾Done',
    summary: '精霊を暖めて焚き火を維持するサバイバルアクション。初めてのUnreal Engine作品として、Blueprintを中心に個人制作しました。',
    tools: 'Unreal Engine / Blueprint',
    youtubeId: '9ngD_UeFAzw',
    thumbnail: '',
    images: [],
    description: '暖気弾で精霊を暖め、焚き火の燃料に変えながら夜を乗り切る、温度管理サバイバルアクションです。学校で学んだUnreal Engineを使って初めて制作したゲームで、第26回UE5ぷちコンへの応募作品です。',
    period: '約2週間',
    teamSize: '1人（個人制作）',
    role: '制作全般',
    highlights: 'Blueprintで処理の流れを一つずつ追いながら、ゲームのアルゴリズムを組み立てました。コードとは異なる視覚的な実装を経験し、Unreal Engineでの制作方法を学びました。\n\nマテリアルによる表現やNiagaraのエフェクトなど、Unreal Engineならではの機能も活用して制作しました。',
    links: []
  }
];
