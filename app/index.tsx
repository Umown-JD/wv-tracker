import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '@/constants/colors';
import { ROLES, TEAM_COLORS, TEAM_LABELS, TEAMS, type Role, type Team } from '@/constants/roles';
import { useTracker, type Marker, type PlayerSlot } from '@/context/TrackerContext';

const C = colors.dark;
const { width: SW, height: SH } = Dimensions.get('window');

// Panel dimensions
const PANEL_W = Math.min(SW - 32, 340);
const COLS = 4;
const CARD = (PANEL_W - 16 - (COLS - 1) * 6) / COLS;

// ─── Marker color helper ───────────────────────────────────────────────────

function markerColor(m: Marker): string | null {
  if (m === 'good') return C.good;
  if (m === 'evil') return C.evil;
  if (m === 'unknown') return C.unknown;
  return null;
}

// ─── PlayerCard ─────────────────────────────────────────────────────────────

interface PlayerCardProps {
  num: number;
  slot: PlayerSlot;
  onPress: () => void;
}

function PlayerCard({ num, slot, onPress }: PlayerCardProps) {
  const mc = markerColor(slot.marker);
  const teamBorder = slot.role ? TEAM_COLORS[slot.role.team] : C.border;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { width: CARD, height: CARD, borderColor: teamBorder },
        slot.dead && styles.cardDead,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardNum}>{num}</Text>
        {mc && <View style={[styles.markerDot, { backgroundColor: mc }]} />}
      </View>
      <Text style={styles.cardEmoji}>
        {slot.role ? slot.role.emoji : '＋'}
      </Text>
      {slot.dead && (
        <View style={styles.deadX}>
          <Feather name="x" size={9} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── RolePickerModal ─────────────────────────────────────────────────────────

interface RolePickerModalProps {
  num: number | null;
  onClose: () => void;
}

function RolePickerModal({ num, onClose }: RolePickerModalProps) {
  const { getSlot, updateSlot } = useTracker();
  const [search, setSearch] = useState('');

  const slot = num !== null ? getSlot(num) : null;

  const act = (patch: Partial<PlayerSlot>) => {
    if (num === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSlot(num, patch);
    onClose();
  };

  const setMarker = (m: Marker) => {
    if (!slot) return;
    // Toggle off if already set
    act({ marker: slot.marker === m ? null : m });
  };

  const setRole = (role: Role) => {
    if (num === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateSlot(num, { role });
    onClose();
  };

  const clearRole = () => {
    if (num === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSlot(num, { role: null });
    // Don't close — user may want to pick a different role
  };

  const toggleDead = () => {
    if (!slot) return;
    act({ dead: !slot.dead });
  };

  const filteredByTeam = useMemo(() => {
    const q = search.toLowerCase();
    return TEAMS.map(team => ({
      team,
      roles: ROLES.filter(r => r.team === team && r.name.toLowerCase().includes(q)),
    })).filter(g => g.roles.length > 0);
  }, [search]);

  if (num === null || !slot) return null;

  const markerActive = (m: Marker) => slot.marker === m;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Player {num}</Text>
          {slot.role && (
            <TouchableOpacity onPress={clearRole} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear role</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick actions row */}
        <View style={styles.actionRow}>
          {([['good', '😇 Good', C.good], ['evil', '😈 Evil', C.evil], ['unknown', '❓ Aura', C.unknown]] as [Marker, string, string][]).map(([m, label, color]) => (
            <TouchableOpacity
              key={m}
              style={[styles.actionBtn, markerActive(m) && { backgroundColor: color + '30', borderColor: color }]}
              onPress={() => setMarker(m)}
            >
              <Text style={[styles.actionBtnText, { color: markerActive(m) ? color : C.mutedForeground }]}>{label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.actionBtn, slot.dead && { backgroundColor: '#ef444430', borderColor: C.destructive }]}
            onPress={toggleDead}
          >
            <Text style={[styles.actionBtnText, { color: slot.dead ? C.destructive : C.mutedForeground }]}>
              {slot.dead ? '💀 Dead' : '❤️ Alive'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search roles..."
          placeholderTextColor={C.mutedForeground}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Role list */}
        <ScrollView style={styles.roleList} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {filteredByTeam.map(({ team, roles }) => (
            <View key={team}>
              <Text style={[styles.teamLabel, { color: TEAM_COLORS[team as Team] }]}>
                {TEAM_LABELS[team as Team].toUpperCase()}
              </Text>
              {roles.map(role => (
                <TouchableOpacity
                  key={role.id}
                  style={[styles.roleRow, slot.role?.id === role.id && styles.roleRowActive]}
                  onPress={() => setRole(role)}
                >
                  <Text style={styles.roleEmoji}>{role.emoji}</Text>
                  <Text style={styles.roleName}>{role.name}</Text>
                  {slot.role?.id === role.id && (
                    <Feather name="check" size={13} color={TEAM_COLORS[role.team]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Player Count Picker ──────────────────────────────────────────────────────

const COUNT_OPTS = [4, 6, 8, 10, 12, 14, 16, 18, 20];

interface CountModalProps {
  visible: boolean;
  current: number;
  onSelect: (n: number) => void;
  onClose: () => void;
}

function CountModal({ visible, current, onSelect, onClose }: CountModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.countSheet}>
        <Text style={styles.countTitle}>Players in game</Text>
        <View style={styles.countRow}>
          {COUNT_OPTS.map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.countOpt, n === current && styles.countOptActive]}
              onPress={() => { onSelect(n); onClose(); }}
            >
              <Text style={[styles.countOptText, n === current && styles.countOptTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

// ─── Floating Panel ───────────────────────────────────────────────────────────

export default function TrackerScreen() {
  const insets = useSafeAreaInsets();
  const { playerCount, setPlayerCount, resetGame, getSlot } = useTracker();

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [showCount, setShowCount] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Draggable position
  const initX = (SW - PANEL_W) / 2;
  const initY = insets.top + 20;
  const pan = useRef(new Animated.ValueXY({ x: initX, y: initY })).current;
  const panOffset = useRef({ x: initX, y: initY });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        pan.setOffset(panOffset.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        pan.flattenOffset();
        // Clamp to screen
        const nx = Math.max(0, Math.min(SW - PANEL_W, panOffset.current.x + g.dx));
        const ny = Math.max(insets.top, Math.min(SH - 80, panOffset.current.y + g.dy));
        panOffset.current = { x: nx, y: ny };
        pan.setValue({ x: nx, y: ny });
      },
    })
  ).current;

  const players = useMemo(
    () => Array.from({ length: playerCount }, (_, i) => i + 1),
    [playerCount]
  );

  const handleReset = () => {
    Alert.alert('New Game', 'Clear all player data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          resetGame();
        },
      },
    ]);
  };

  const panelRows = useMemo(() => {
    const rows: number[][] = [];
    for (let i = 0; i < players.length; i += COLS) {
      rows.push(players.slice(i, i + COLS));
    }
    return rows;
  }, [players]);

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[styles.panel, { width: PANEL_W, transform: pan.getTranslateTransform() }]}
      >
        {/* Drag handle / header */}
        <View style={styles.panelHeader} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
          <View style={styles.headerContent}>
            <Text style={styles.panelTitle}>🐺 Tracker</Text>
            <View style={styles.headerBtns}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowCount(true)}>
                <Feather name="users" size={13} color={C.mutedForeground} />
                <Text style={styles.iconBtnText}>{playerCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleReset}>
                <Feather name="refresh-cw" size={13} color={C.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setMinimized(v => !v)}>
                <Feather name={minimized ? 'chevron-down' : 'chevron-up'} size={13} color={C.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Grid */}
        {!minimized && (
          <View style={styles.grid}>
            {panelRows.map((row, ri) => (
              <View key={ri} style={styles.row}>
                {row.map(num => (
                  <PlayerCard
                    key={num}
                    num={num}
                    slot={getSlot(num)}
                    onPress={() => setSelectedPlayer(num)}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      <RolePickerModal num={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      <CountModal
        visible={showCount}
        current={playerCount}
        onSelect={setPlayerCount}
        onClose={() => setShowCount(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Floating panel ──
  panel: {
    position: 'absolute',
    backgroundColor: '#1a1f2eee',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  panelHeader: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  dragHandle: {
    width: 36,
    height: 3,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: C.foreground,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: C.secondary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  iconBtnText: {
    color: C.mutedForeground,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },

  // ── Grid ──
  grid: {
    padding: 8,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  card: {
    backgroundColor: C.secondary,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardDead: {
    opacity: 0.35,
  },
  cardHeader: {
    position: 'absolute',
    top: 3,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNum: {
    color: C.mutedForeground,
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
  },
  markerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  cardEmoji: {
    fontSize: 22,
  },
  deadX: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: C.destructive,
    borderRadius: 5,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Backdrop ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // ── Role picker sheet ──
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '82%',
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sheetTitle: {
    color: C.foreground,
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: C.secondary,
    borderRadius: 6,
  },
  clearBtnText: {
    color: C.destructive,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    padding: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: C.secondary,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  searchInput: {
    marginHorizontal: 14,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: C.input,
    borderRadius: 8,
    color: C.foreground,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: C.border,
  },
  roleList: {
    flex: 1,
    paddingHorizontal: 14,
  },
  teamLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 3,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  roleRowActive: {
    backgroundColor: C.accent,
  },
  roleEmoji: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  roleName: {
    flex: 1,
    color: C.foreground,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // ── Count modal ──
  countSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  countTitle: {
    color: C.foreground,
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  countRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  countOpt: {
    width: 52,
    height: 44,
    backgroundColor: C.secondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  countOptActive: {
    borderColor: C.primary,
  },
  countOptText: {
    color: C.mutedForeground,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  countOptTextActive: {
    color: C.primary,
  },
});
